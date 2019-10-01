const express = require('express');
const models = require('../../db/models');
const { auth } = require('../../middleware/auth');

const router = express.Router();

router.get('/users/login/google/callback', auth, async (req, res) => {
  // TODO add error handling and param validation here
  const code = req.query.code;
  const { tokens } = await req.oauth2Client.getToken(code);

  req.oauth2Client.setCredentials(tokens);

  const {
    data: { email, given_name, family_name, picture },
  } = await req.oauth2.userinfo.get();

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
    res.redirect(
      `http://localhost:8080/auth/google/token?access_token=${
        tokens.access_token
      }`
    );
  });
});

router.post('/users/login/google/authUrl', auth, async (req, res) => {
  const scope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  const url = await req.oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    scope,
  });

  res.json(url);
});

router.post('/users/login/google/checktoken', auth, async (req, res) => {
  const currentToken = req.body.token;
  let tokenInfo = {};
  try {
    tokenInfo = await req.oauth2Client.getTokenInfo(currentToken);

    res.sendStatus(200);
  } catch (e) {
    // When token is invalid, error is 400 (bad request)
    req.oauth2Client.setCredentials({});
    if (Number(e.code) === 400) {
      // eslint-disable-next-line no-console
      console.warn('tokenInfo', tokenInfo);
      User.findOne({ where: { email: tokenInfo.email } })
        .then(async user => {
          if (!user.refresh_token) {
            res.sendStatus(401);
          }

          req.oauth2Client.setCredentials({ refresh_token: refreshToken });
          const newAccessToken = await req.oauth2Client.getAccessToken();

          // TODO use bcrypt to hash data stored in DB
          await user.addAccessToken(newAccessToken);
          await user.removeAccessToken(currentToken);
          console.log('deleted old token:', deleted);

          req.oauth2Client.setCredentials({});
          res.send(newAccessToken);
        })
        .catch(e => {
          console.warn('error trying to getAccessToken?', e);
          req.oauth2Client.setCredentials({});
          res.status(401).send(e.message);
        });
    } else {
      res.status(e.code).send(e.message);
    }
  }
});

module.exports = router;
