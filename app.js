const express = require('express');
const bodyParser = require('body-parser');

const test = require('./routes/test');
const models = require('./db/models');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ msg: 'Wannabook!' }));

app.use('/test', test);

const port = process.env.PORT || 5000;

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
