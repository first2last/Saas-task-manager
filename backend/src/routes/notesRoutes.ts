import { Router } from 'express';
import {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} from '../controllers/notesController';
import { tenantMiddleware } from '../middleware/tenantMiddleware';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Apply middleware to all routes
router.use(tenantMiddleware);
router.use(authMiddleware);

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
