const express = require('express');
const { auth } = require('../middleware/auth');
const models = require('../db/models');

const router = express.Router();

router.post('/users/login', async (req, res) => {
  try {
    const user = await models['User'].findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
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

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.access_tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
