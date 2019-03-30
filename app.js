const express = require('express');
const bodyParser = require('body-parser');
const test = require('./routes/api/test');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.json({msg: 'Wannabook!'}));

app.use('/api', test);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));