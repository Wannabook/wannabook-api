const auth = (req, res, next) => {
  try {
    if (Math.random() > 0.5) {
      throw new Error();
    }
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = {
  auth,
};