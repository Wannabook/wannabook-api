const express = require('express');
const { google } = require('googleapis');
const { port } = require('../app');

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID_GOOGLE,
  process.env.CLIENT_SECRET_GOOGLE,
  `http://localhost:${port}/users/login/google/callback`
);

router.get('/users/login/google/callback', async (req, res) => {
  // TODO add error handling here
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.redirect(
    `http://localhost:8080/auth?access_token=${tokens.access_token}`
  );
});

router.post('/users/login/google/getAuthUrl', async (req, res) => {
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
      console.warn('tokenInfo', tokenInfo);
      User.findOne(
        { email: tokenInfo.email },
        'refreshToken',
        async (err, body) => {
          const { refreshToken } = body || {};
          if (err || !refreshToken) {
            res.status(401).send(e.message);

            return;
          }

          oauth2Client.setCredentials({ refresh_token: refreshToken });

          try {
            const newAccessToken = await oauth2Client.getAccessToken();
            console.warn('newAccessToken:', newAccessToken);
            // TODO store new access_token in DB
            oauth2Client.setCredentials({});

            // TODO use bcrypt to hash data stored in DB
            await User.update(
              { accessTokens: currentToken },
              { $push: { accessTokens: newAccessToken.token } },
              { upsert: true }
            ).exec();
            console.warn('added new token to tokens array of this user');
            // TODO Fix access token not being deleted from tokens array
            const deleted = await User.update(
              { accessTokens: currentToken },
              { $pull: { accessTokens: currentToken } }
            ).exec();

            console.log('deleted old token:', deleted);

            res.send(newAccessToken);
          } catch (e) {
            console.warn('error trying to getAccessToken?', e);
            oauth2Client.setCredentials({});
            res.status(401).send(e.message);
          }
        }
      );
    } else {
      res.status(e.code).send(e.message);
    }
  }
});
