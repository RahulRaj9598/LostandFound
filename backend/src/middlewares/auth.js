import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_access_secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(httpStatus.FORBIDDEN).json({ error: 'Forbidden' });
    }
    next();
  };
}


