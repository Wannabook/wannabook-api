const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/user');
const { auth } = require('../middleware/auth');

router.post('/users', async (req, res) => {
  try {
    const user = await UserModel.save(req.body);
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users', auth, async (req, res) => {
  try {
    const users = await UserModel.getUsers();
    res.status(200).send(users);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await UserModel.getUsersById(_id);
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await UserModel.delete(_id);
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
