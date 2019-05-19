const express = require('express');
const router = express.Router();

const models = require('../db/models');
const { auth } = require('../middleware/auth');

router.post('/users', async (req, res) => {
  try {
    const user = await models['User'].create(req.body);
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
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
    await models['User'].destroy({
      where: {
        id: _id,
      },
    });
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
