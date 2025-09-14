import { Router } from 'express';
import { login } from '../controllers/authController';
import { tenantMiddleware } from '../middleware/tenantMiddleware';

const router = Router();

router.post('/login', tenantMiddleware, login);

export default router;
