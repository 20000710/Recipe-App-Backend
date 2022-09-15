const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../helpers/env');

module.exports = async (payload) => {
  const token = await jwt.sign(payload, JWT_SECRET);
  return token;
};
