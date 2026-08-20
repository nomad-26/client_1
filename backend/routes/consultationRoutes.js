import express from 'express';
import { createConsultation, getConsultations, getConsultationById, updateConsultationStatus } from '../controllers/consultationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow unauthenticated POST (guest can book a consultation without account)
router.post('/', createConsultation);
// GET routes require auth
router.get('/', protect, getConsultations);
router.get('/:id', protect, getConsultationById);
// Status updates are admin-only
router.patch('/:id/status', protect, adminOnly, updateConsultationStatus);

export default router;
