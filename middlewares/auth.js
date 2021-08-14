const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_STATUS_CODE } = require('../errors/errors');

module.exports = (req, res, next) => {
  const { token } = req.headers;
  let playload;
  try {
    playload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_STATUS_CODE).send({ message: 'Необходима авторизация' });
  }
  req.user = playload;
  next();
  return undefined;
};
