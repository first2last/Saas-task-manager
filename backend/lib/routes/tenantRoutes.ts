import { Router } from 'express';
import { upgradeTenant, downgradeTenant } from '../controllers/tenantsController';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post(
  '/:slug/upgrade',
  tenantMiddleware,
  authMiddleware,
  requireRole(['admin']),
  upgradeTenant
);

// ADD THIS NEW ROUTE:
router.post(
  '/:slug/downgrade',
  tenantMiddleware,
  authMiddleware,
  requireRole(['admin']),
  downgradeTenant
);

export default router;
