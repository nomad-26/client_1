import express from 'express';
import { createRequest, getRequests, getRequestById, updateRequestStatus } from '../controllers/requestController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated routes — customers get their own, admins get all
router.post('/', createRequest);
router.get('/', protect, getRequests);
router.get('/:id', protect, getRequestById);
router.patch('/:id/status', protect, adminOnly, updateRequestStatus);

export default router;
