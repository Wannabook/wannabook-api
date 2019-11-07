const express = require('express');

const { auth } = require('../../middleware/auth');
const models = require('../../db/models');

const router = express.Router();

router.post('/users/login', auth, async (req, res) => {
  try {
    const token = await req.user.generateAuthToken();
    res.send({ user: req.user, token, authMethod: AUTH_METHOD.LOGIN_PASSWORD });
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
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.access_tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// TODO: Create signup routes!!!
router.post('/users/signup', async (req, res) => {
  try {
    const { email, password } = req;

    if (!email || !password) {
      return res.status(400).send({ message: 'Email or password not set' });
    }

    const user = await models['User'].build({ email, password });
    const token = await user.generateAuthToken(email);

    await user.save();

    res.status(201).send({ token, authMethod: AUTH_METHOD.LOGIN_PASSWORD });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
