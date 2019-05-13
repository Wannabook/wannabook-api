const models = require('../db/models');

module.exports = (req, res) => {
  models['User'].findAll().then(users => {
    res.json(users);
  });
};
