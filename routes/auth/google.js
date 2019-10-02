const express = require('express');
const models = require('../../db/models');
const { AUTH_METHOD } = require('./consts');

const router = express.Router();

router.get('/users/login/google/callback', async (req, res) => {
  // TODO add error handling and param validation here
  const code = req.query.code;
  const { oauth2, oauth2Client } = req.app.locals;

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const {
    data: { email },
  } = await oauth2.userinfo.get();

  models['User'].findOne({ where: { email } }).then(async user => {
    if (user) {
      // TODO use bcrypt to hash data stored in DB
      await user.removeOldAccessTokens();
      await user.updateRefreshToken(tokens.refresh_token);
      await user.addAccessToken(tokens.access_token);
    } else {
      // TODO also use bcrypt
      // TODO create a user in our table with all info
      // TODO add user picture to DB schema
      // await models['User'].create({
      //   first_name: given_name,
      //   last_name: family_name,
      //   email,
      //   access_tokens: [tokens.access_token],
      //   refresh_token: tokens.refresh_token,
      // });
    }
  });

  if (!res.headersSent) {
    res.redirect(
      `http://localhost:8080/auth/google/token?access_token=${
        tokens.access_token
      }&auth_method=${AUTH_METHOD.GOOGLE}`
    );
  }
});

router.post('/users/login/google/auth', async (req, res) => {
  const oauth2Client = req.app.locals.oauth2Client;
  const scope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const url = await oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope,
  });

  res.json(url);
});

module.exports = router;
