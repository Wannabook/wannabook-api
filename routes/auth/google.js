const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../../db/models');
const { AUTH_METHOD } = require('./consts');

const router = express.Router();

router.get('/users/login/google/callback', async (req, res) => {
  // TODO add error handling and param validation here
  const code = req.query.code;
  const { oauth2Client } = req.app.locals;

  const { tokens } = await oauth2Client.getToken(code);

  const decoded = jwt.decode(tokens.id_token);

  if (decoded) {
    const { email, given_name, family_name, picture } = decoded;

    models['User'].findOne({ where: { email } }).then(async user => {
      if (user) {
        // TODO use bcrypt to hash data stored in DB
        // TODO: optimize these requests to unite into one?
        await user.removeOldAccessTokens();
        await user.updateRefreshToken(tokens);
        await user.addAccessToken(tokens.access_token);
      } else {
        // TODO also use bcrypt
        await models['User'].create({
          first_name: given_name,
          last_name: family_name,
          email,
          picture,
          access_tokens: [tokens.access_token],
          refresh_token: tokens.refresh_token,
          id_token: tokens.id_token,
        });
      }
    });

    // Send tokens to frontend
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/token?access_token=${
        tokens.access_token
      }&auth_method=${AUTH_METHOD.GOOGLE}&id_token=${tokens.id_token}`
    );
  } else {
    return res.status(400).send('Id token invalid');
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
    access_type: 'offline', // gets refresh_token
    scope,
  });

  res.send(url);
});

module.exports = router;
