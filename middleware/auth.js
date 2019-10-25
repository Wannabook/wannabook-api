const jwt = require('jsonwebtoken');

const {
  ACCESS_TOKEN_HEADER,
  AUTH_METHOD_HEADER,
  ID_TOKEN_HEADER,
} = require('../routes/auth/consts');
const models = require('../db/models');
const { AUTH_METHOD } = require('../routes/auth/consts');

const auth = async (req, res, next) => {
  const token = getTokenFromRequest(req);
  const authType = req.header(AUTH_METHOD_HEADER);
  const idToken = req.header(ID_TOKEN_HEADER);
  const { oauth2Client } = req.app.locals;

  if (!token || !authType) {
    // TODO: process these errors on UI (WNB-163)
    return res
      .status(401)
      .send('Either token or X-Auth-Method header were not set');
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
          return res.status(401).send(e);
        }
      }
      break;

    case AUTH_METHOD.GOOGLE:
      {
        // TODO: perform checks for missing headers/tokens in a single place
        if (!idToken) return res.sendStatus(400);

        try {
          const decoded = jwt.decode(idToken);

          if (decoded) {
            const { email } = decoded;
            console.warn('decoded email', email);
            user = await models['User'].findByEmail(email);
          }

          if (!user) return res.sendStatus(401);

          // Check if user ever had a token like the received access token
          const userHadThisAccessToken = user.access_tokens.find(
            accessToken => accessToken === token
          );

          if (!userHadThisAccessToken) {
            return res.sendStatus(401);
          }

          req.refresh_token = user.refresh_token;
        } catch (error) {
          console.error('error after findByEmail', error);

          const status = Number(error.code) || 401;

          return res.status(status).send({
            status,
            message: 'Please authenticate',
            // devMessage: JSON.stringify(error),
            // errorClass: UNAUTHORIZED // for frontend processing
          });
        }
      }
      break;

    default: {
      return (
        res
          .status(400)
          // TODO: maybe we could send an object:
          // 1) some human-readable non-technical info for frontend,
          // 2) some technical stuff like below - for backend logging
          .send(`Please set the correct ${AUTH_METHOD_HEADER} header`)
      );
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
    // If token is too old (or also invalid), error is 400
    // TODO: don't proceed with invalid token!!!
    if (Number(e.code) === 400) {
      console.warn('tokenInfo in catch', tokenInfo);
      console.warn('e in catch', e);

      if (!req.user || !req.refresh_token) {
        console.warn('no user or refresh token set');

        return res.status(401).send('No user or refresh token set');
      }

      try {
        // Try getting a refresh token
        oauth2Client.setCredentials({ refresh_token: req.refresh_token });
        const { token: newAccessToken } = await oauth2Client.getAccessToken();
        oauth2Client.setCredentials({});

        console.warn('after getting new access token');

        // TODO use bcrypt to hash data stored in DB
        // TODO: optimize by making one function instead of one
        await user.addAccessToken(newAccessToken);
        await user.removeAccessToken(token);
        console.log('deleted old token');

        req.accessToken = newAccessToken;

        next();
      } catch (error) {
        console.warn('error', error);
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
