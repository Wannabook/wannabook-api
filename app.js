const express = require('express');
const bodyParser = require('body-parser');

const test = require('./routes/test');
const config = require('./configuration/config');
const models = require('./models');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({msg: 'Wannabook!'}));

app.use('/test', test);

const devPort = config.app.port;
const port = process.env.PORT || devPort;

models.sequelize.sync().then(function() {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
