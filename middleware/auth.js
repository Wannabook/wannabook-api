const jwt = require('jsonwebtoken');
const models = require('../db/models');
const { google } = require('googleapis');
const { AUTH_TYPE } = require('../routes/auth/consts');

const auth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const authType = req.header('X-Auth-Method');

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID_GOOGLE,
    process.env.CLIENT_SECRET_GOOGLE,
    `http://localhost:${process.env.PORT}/users/login/google/callback`
  );

  const oauth2 = google.oauth2({
    auth: req.oauth2Client,
    version: 'v2',
  });

  let user;

  switch (authType) {
    case AUTH_TYPE.LOGIN_PASSWORD:
      {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await models['User'].findByPk(decoded.id);
      }
      break;

    case AUTH_TYPE.FB:
      {
        const {
          data: { email },
        } = await req.oauth2.userinfo.get();
        user = await models['User'].findByEmail(email);
      }
      break;

    default: {
      res.status(401);
    }
  }

  req.token = token;
  req.user = user;
  req.oauth2Client = oauth2Client;
  req.oauth2 = oauth2;

  next();
};

module.exports = {
  auth,
};
