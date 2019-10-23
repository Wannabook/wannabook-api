const jwt = require('jsonwebtoken');

const {
  ACCESS_TOKEN_HEADER,
  AUTH_METHOD_HEADER,
  ID_TOKEN_HEADER,
} = require('../routes/auth/consts');
const models = require('../db/models');
const { AUTH_METHOD } = require('../routes/auth/consts');

async function getEmailByIdToken(client, idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    // audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return payload['email'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}

const auth = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  const authType = req.header(AUTH_METHOD_HEADER);
  const idToken = req.header(ID_TOKEN_HEADER);
  const { oauth2Client } = req.app.locals;

  if (!token || !authType) {
    // TODO: process these errors on UI (WNB-163)
    res.status(401).send('Either token or X-Auth-Method header were not set');
  }

  let user;

  switch (authType) {
    // TODO: ensure it works and sync with frontend in WNB-154
    case AUTH_METHOD.LOGIN_PASSWORD:
      {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await models['User'].findByPk(decoded.id);
        } catch (e) {
          // TODO: test the case when jwt fails verification
          res.status(401).send(e);

          return;
        }
      }
      break;

    case AUTH_METHOD.GOOGLE:
      {
        const { oauth2Client } = req.app.locals;
        oauth2Client.setCredentials({ access_token: token });

        if (!idToken) return res.sendStatus(400);

        try {
          const email = await getEmailByIdToken(oauth2Client, idToken);

          console.warn('email', email);

          user = await models['User'].findByEmail(email);
          req.refresh_token = user.refresh_token;
        } catch (e) {
          console.error('error after getEmailByIdToken');
          const status = Number(e.code) || 401;

          res.status(status).send({
            status,
            message: 'Please authenticate',
            /*errorClass: UNAUTHORIZED*/ // for frontend processing
          });

          return;
        }
      }
      break;

    default: {
      res
        .status(400)
        // TODO: maybe we could send an object:
        // 1) some human-readable non-technical info for frontend,
        // 2) some technical stuff like below - for backend
        .send(`Please set the correct ${AUTH_METHOD_HEADER} header`);
    }
  }

  req.user = user;

  // TODO: maybe set up some universal middleware to handle all possible errors
  let tokenInfo = {};

  try {
    tokenInfo = await oauth2Client.getTokenInfo(token);
    console.warn('tokenInfo in try', tokenInfo);

    next();
  } catch (e) {
    // If token is too old but was valid, error is 400
    oauth2Client.setCredentials({});

    if (Number(e.code) === 400) {
      console.warn('tokenInfo in catch', tokenInfo);
      console.warn('e in catch', e);

      if (!req.user || !req.refresh_token) {
        console.warn('no user or refresh token set');

        res.status(401).send('No user or refresh token set');

        return;
      }

      oauth2Client.setCredentials({ refresh_token: req.refresh_token });

      // Try getting a refresh token
      try {
        const { token: newAccessToken } = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials({});

        console.warn('after getting new access token');

        // TODO use bcrypt to hash data stored in DB
        await user.addAccessToken(newAccessToken);
        await user.removeAccessToken(token);
        console.log('deleted old token');

        req.accessToken = newAccessToken;

        next();
      } catch (error) {
        console.warn('catch getting new access token');

        return res.sendStatus(401);
      }
    } else {
      console.warn('error code is not 400');
      res.status(Number(e.code) || 401).send(e.message);
    }
  }

  next();
};

module.exports = {
  auth,
};

const getTokenFromRequest = req => {
  let token = req.header(ACCESS_TOKEN_HEADER);

  if (token) {
    token = token.replace('Bearer ', '');
  }

  return token;
};
