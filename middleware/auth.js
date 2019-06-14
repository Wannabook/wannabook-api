const jwt = require('jsonwebtoken');
const models = require('../db/models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models['User'].findByPk(decoded.id);
    if (!user || !isTokenPresent(user.access_tokens, token)) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

const isTokenPresent = (tokens, token) => {
  return tokens.filter(t => t.token === token).length > 0;
};

module.exports = {
  auth,
};
