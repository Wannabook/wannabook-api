const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const models = require('./db/models');
const userHandler = require('./routes/user');
const organizationHandler = require('./routes/organization');
const googleAuth = require('./routes/auth/google');
const loginPasswordAuth = require('./routes/auth/login-password');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userHandler);
app.use(organizationHandler);
app.use(googleAuth);
app.use(loginPasswordAuth);

const port = process.env.PORT || 5000;

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

module.exports = port;
