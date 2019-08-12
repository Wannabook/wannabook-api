const express = require('express');
const bodyParser = require('body-parser');

const models = require('./db/models');
const userHandler = require('./routes/user');
const organizationHandler = require('./routes/organization');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userHandler);
app.use(organizationHandler);

const port = process.env.PORT || 5000;

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

module.exports = port;
