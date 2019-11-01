const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');

const models = require('./db/models');
const userHandler = require('./routes/user');
const organizationHandler = require('./routes/organization');
const googleAuth = require('./routes/auth/google');
const loginPasswordAuth = require('./routes/auth/login-password');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const basePath = `/api/v${process.env.API_VERSION}`;

app.use(basePath, userHandler);
app.use(basePath, organizationHandler);
app.use(basePath, googleAuth);
app.use(basePath, loginPasswordAuth);

app.locals.oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID_GOOGLE,
  process.env.CLIENT_SECRET_GOOGLE,
  `http://localhost:${process.env.PORT}${basePath}/users/login/google/callback`
);

app.locals.oauth = google.oauth2({
  auth: app.locals.oauth2Client,
  version: 'v2',
});

const port = process.env.PORT || 5000;

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

module.exports = port;
