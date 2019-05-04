const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user');
const config = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ msg: 'Wannabook!' }));

app.use(userRouter);

const devPort = config.app.port;
const port = process.env.PORT || devPort;

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
