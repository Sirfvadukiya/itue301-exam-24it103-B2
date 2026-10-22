const jwt = require('jsonwebtoken');
const AppError = require('./AppError');

// authGuard: validates the "Authorization: Bearer <token>" header.
// Missing / invalid / expired token -> 401. Valid token -> req.user = { id, role }
const authGuard = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError('Authentication required: missing Bearer token', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};

// Optional role check (used only for creating events)
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to do this', 403));
  }
  next();
};

module.exports = { authGuard, requireRole };
