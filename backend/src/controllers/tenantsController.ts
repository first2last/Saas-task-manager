import { Response } from 'express';
import { Tenant } from '../models/Tenant';
import { AuthenticatedRequest } from '../middleware/tenantMiddleware';

export const upgradeTenant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (req.tenant.slug !== slug) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { plan: 'pro', noteLimit: -1 },
      { new: true }
    );

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    res.json({
      message: 'Successfully upgraded to Pro plan',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        plan: tenant.plan,
        noteLimit: tenant.noteLimit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ADD THIS DOWNGRADE FUNCTION:
export const downgradeTenant = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (req.tenant.slug !== slug) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { plan: 'free', noteLimit: 3 },
      { new: true }
    );

    if (!tenant) {
      res.status(404).json({ error: 'Tenant not found' });
      return;
    }

    res.json({
      message: 'Successfully downgraded to Free plan',
      tenant: {
        id: tenant._id,
        name: tenant.name,
        plan: tenant.plan,
        noteLimit: tenant.noteLimit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
