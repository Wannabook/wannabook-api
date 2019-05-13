const express = require('express');
const bodyParser = require('body-parser');

const models = require('./db/models');
const userHandler = require('./routes/user');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(userHandler);

const port = process.env.PORT || 5000;

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
