const express = require('express');
const { google } = require('googleapis');
const models = require('../../db/models');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID_GOOGLE,
  process.env.CLIENT_SECRET_GOOGLE,
  `http://localhost:${process.env.PORT}/users/login/google/callback`
);

router.get('/users/login/google/callback', async (req, res) => {
  // TODO add error handling and param validation here
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  const { email } = await oauth2Client.getTokenInfo(tokens.access_token);
  oauth2Client.setCredentials(tokens);

  models['User'].findOne({ where: { email } }).then(async user => {
    if (user) {
      // TODO use bcrypt to hash data stored in DB
      await user.removeOldAccessTokens();
      await user.updateRefreshToken(tokens.refresh_token);
      await user.addAccessToken(tokens.access_token);
    } else {
      // TODO create a user in our table with all info
      // TODO also use bcrypt
      // oauth2Client.userinfo.get?
    }
    res.redirect(
      `http://localhost:8080/auth/google/token?access_token=${
        tokens.access_token
      }`
    );
  });
});

router.post('/users/login/google/authUrl', async (req, res) => {
  const scope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const url = await oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope,
  });

  res.json(url);
});

router.post('/users/login/google/checktoken', async (req, res) => {
  const currentToken = req.body.token;
  let tokenInfo = {};
  try {
    tokenInfo = await oauth2Client.getTokenInfo(currentToken);

    res.sendStatus(200);
  } catch (e) {
    // When token is invalid, error is 400 (bad request)
    oauth2Client.setCredentials({});
    if (Number(e.code) === 400) {
      // eslint-disable-next-line no-console
      console.warn('tokenInfo', tokenInfo);
      User.findOne({ where: { email: tokenInfo.email } })
        .then(async user => {
          if (!user.refresh_token) {
            res.status(401).send();
          }

          oauth2Client.setCredentials({ refresh_token: refreshToken });
          const newAccessToken = await oauth2Client.getAccessToken();

          // TODO use bcrypt to hash data stored in DB
          await user.addAccessToken(newAccessToken);
          await user.removeAccessToken(currentToken);
          console.log('deleted old token:', deleted);

          oauth2Client.setCredentials({});
          res.send(newAccessToken);
        })
        .catch(e => {
          console.warn('error trying to getAccessToken?', e);
          oauth2Client.setCredentials({});
          res.status(401).send(e.message);
        });
    } else {
      res.status(e.code).send(e.message);
    }
  }
});

module.exports = router;
