import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/generateToken';
import { User } from '../models/User';
import { AuthenticatedRequest } from './tenantMiddleware';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).populate('tenantId');

    if (!user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Ensure user belongs to the current tenant
    if (req.tenant && user.tenantId._id.toString() !== req.tenant._id.toString()) {
      res.status(403).json({ error: 'Access denied to this tenant' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
