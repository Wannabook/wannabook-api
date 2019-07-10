const express = require('express');
const router = express.Router();

const models = require('../db/models');

router.get('/organizations', async (req, res) => {
  try {
    const orgs = await models['Organization'].findAll();
    res.status(200).send(orgs);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/organizations/:id/staff', async (req, res) => {
  try {
    const staffByOrg = await models['Organization'].findAll({
      where: {
        id: req.params.id,
      },
      include: [models['Staff']],
    });
    res.status(200).send(staffByOrg);
  } catch (e) {
    res.status(400).send(e);
  }
});

// TODO implement other methods

module.exports = router;
