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
    res.status(400).send({ error: e.message });
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
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

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.destroy();
    res.send(req.user);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;

router.post('/test-db-ops', (req, res) => {
  models['User']
    .findOne({ where: { email: 'ilya@demo.com' } })
    // .then(user => {
    //   user.refresh_token
    //   return user.removeAccessToken('token2');
    //   // return user.addAccessToken('cfffd2');
    // })
    .then(user => {
      res.send(user.refresh_token);
    });
});

// remove something from array

// models['User']
// .findOne({
//   where: {
//     email: 'ilya@demo.com',
//   },
// })
// .then(user => {
//   // const restTokens = user.access_tokens.filter(t => t !== 'someOtherToken');
//   user
//   .update(
//     {
//       access_tokens: restTokens,
//     },
//     {
//       where: {
//         email: 'ilya@demo.com',
//       },
//     }
//   )
//   .then(user => res.json(user));
// });

// add something to array
// models['User']
// .findOne({
//   where: {
//     email: 'ilya@demo.com',
//   },
// })
// .then(user => {
//   user.access_tokens.push('sometoken');
//   user
//   .update(
//     {
//       access_tokens: user.access_tokens,
//     },
//     {
//       where: {
//         email: 'ilya@demo.com',
//       },
//     }
//   )
//   .then(user => res.json(user));
// });
