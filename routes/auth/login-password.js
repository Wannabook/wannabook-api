const express = require('express');

const { auth } = require('../../middleware/auth');
const models = require('../../db/models');
const { AUTH_METHOD } = require('../auth/consts');

const router = express.Router();

router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return (
        res
          .status(400)
          // TODO would be nice to make these messages language-independent
          .send({ message: 'Пожалуйста, заполните все поля' })
      );
    }

    const user = await models['User'].findByCredentials(email, password);

    if (!user) {
      return res.status(400).send({
        message: 'Неправильный почтовый ящик или пароль',
      });
    }

    const token = await user.generateAuthToken(email);
    res.send({ user, token, authMethod: AUTH_METHOD.LOGIN_PASSWORD });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.access_tokens = req.user.access_tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// TODO: Discuss where we should have this feature on frontend
// log out from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.access_tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.post('/users/signup', async (req, res) => {
  try {
    const { email, password, phone, name } = req.body;

    if (!email || !password || !phone || !name) {
      return (
        res
          .status(400)
          // TODO would be nice to make these messages language-independent
          .send({ message: 'Пожалуйста, заполните все поля регистрации' })
      );
    }

    const alreadyExists = await models['User'].findByEmail(email);

    if (alreadyExists) {
      return res.status(400).send({
        message: 'Пользователь с таким почтовым ящиком уже существует',
      });
    }

    const user = await models['User'].build({
      email,
      password,
      first_name: name,
      phone,
    });
    const token = await user.generateAuthToken(email);

    await user.save();

    res
      .status(201)
      .send({ user, token, authMethod: AUTH_METHOD.LOGIN_PASSWORD });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
