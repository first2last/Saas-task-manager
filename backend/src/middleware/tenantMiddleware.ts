import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../models/Tenant';

export interface AuthenticatedRequest extends Request {
  tenant?: any;
  user?: any;
}

export const tenantMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tenantSlug = req.headers['x-tenant-id'] as string;
    
    if (!tenantSlug) {
      res.status(400).json({ error: 'Tenant ID is required in headers' });
      return;
    }

    const tenant = await Tenant.findOne({ slug: tenantSlug });
    
    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
