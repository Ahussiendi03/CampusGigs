const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Try to get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, 'jwt-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
};
