const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({ error: [{ msg: 'Not Authorized' }] });
    }

    let decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
