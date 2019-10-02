const jwt = require('jsonwebtoken');
const models = require('../db/models');
const { AUTH_TYPE } = require('../routes/auth/consts');

const auth = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401);
  }

  const authType = req.header('X-Auth-Method');
  let user;

  switch (authType) {
    case AUTH_TYPE.LOGIN_PASSWORD:
      {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await models['User'].findByPk(decoded.id);
        } catch (e) {
          // TODO: test the case when jwt fails verification
          res.status(401).send(e);
        }
      }
      break;

    case AUTH_TYPE.GOOGLE:
      {
        const oauth2 = req.app.locals.oauth2;

        const {
          data: { email },
        } = await oauth2.userinfo.get();

        user = await models['User'].findByEmail(email);
      }
      break;

    default: {
      res.status(400).send('Please set the correct x-auth-type');
    }
  }

  req.token = token;
  req.user = user;

  next();
};

const checkToken = async (req, res) => {
  const { user, token } = req;
  const { oauth2Client } = req.app.locals;

  let tokenInfo = {};

  try {
    tokenInfo = await oauth2Client.getTokenInfo(token);

    res.send(user);
  } catch (e) {
    // If token is invalid, error is 400
    oauth2Client.setCredentials({});

    if (Number(e.code) === 400) {
      console.warn('tokenInfo', tokenInfo);

      if (!user.refresh_token) {
        res.sendStatus(401);
      }

      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const newAccessToken = await oauth2Client.getAccessToken();

      // TODO use bcrypt to hash data stored in DB
      await user.addAccessToken(newAccessToken);
      await user.removeAccessToken(token);
      console.log('deleted old token');

      oauth2Client.setCredentials({});
      res.send(newAccessToken);
    } else {
      res.status(e.code).send(e.message);
    }
  }
};

module.exports = {
  checkToken,
  auth,
};

const getTokenFromRequest = req => {
  let token = req.header('Authorization');

  if (token) token.replace('Bearer ', '');

  return token;
};
