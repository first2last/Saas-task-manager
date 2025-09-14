import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { ITenant } from '../models/Tenant';
import { generateToken } from '../utils/generateToken';
import { AuthenticatedRequest } from '../middleware/tenantMiddleware';

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user within the current tenant and populate tenantId
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      tenantId: req.tenant._id 
    }).populate('tenantId');

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Type cast the populated tenantId to ITenant
    const populatedTenant = user.tenantId as unknown as ITenant;

    const token = generateToken({
      userId: user._id,
      tenantId: populatedTenant._id,
      role: user.role
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: populatedTenant._id,
          name: populatedTenant.name,
          plan: populatedTenant.plan,
          slug: populatedTenant.slug
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
