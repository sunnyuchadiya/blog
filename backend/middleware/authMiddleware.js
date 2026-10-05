import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Verify JWT token
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ba86437946f711d7619e5e1f8bff4c50bda0e90af34f6466083cf4f5ca9441bd');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Verify Admin / Editorial Director role
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'Editorial Director' || req.user.email === 'admin@gmail.com')) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admin authorization required' });
};
