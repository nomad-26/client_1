import express from 'express';
import { getLeads, getLeadById, updateLead, addLeadNote } from '../controllers/leadController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getLeads);
router.get('/:id', protect, adminOnly, getLeadById);
router.patch('/:id', protect, adminOnly, updateLead);
router.post('/:id/notes', protect, adminOnly, addLeadNote);

export default router;
