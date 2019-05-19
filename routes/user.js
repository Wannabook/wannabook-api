const express = require('express');
const router = express.Router();

const models = require('../db/models');
const { auth } = require('../middleware/auth');

router.post('/users', async (req, res) => {
  const user = await models['User'].build(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

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

router.get('/users', auth, async (req, res) => {
  try {
    const users = await models['User'].findAll();
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await models['User'].findByPk(_id);
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await models['User'].findByPk(_id);
    if (user) {
      await models['User'].destroy({
        where: {
          id: _id,
        },
      });
      res.status(200).send(user);
    } else {
      res.status(404).send(e);
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
