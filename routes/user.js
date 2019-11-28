const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

router.get('/users/me', auth, (req, res) => {
  res.send({ user: req.user, accessToken: req.token });
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['first_name', 'last_name', 'email', 'password'];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// TODO: do we have this functionality on UI? like 'delete account'...
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.destroy();
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
