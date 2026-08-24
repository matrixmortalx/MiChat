const jwt = require('jsonwebtoken');

const generateToken = (userId, type = 'access') => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = type === 'access' ? process.env.JWT_EXPIRE : process.env.REFRESH_TOKEN_EXPIRE;

  return jwt.sign(
    { userId, type },
    secret,
    { expiresIn }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
};
