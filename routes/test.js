const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {res.json({msg: "Wannabook /test route"})});

module.exports = router;