import express from 'express';
import { getClinicalSummary, createPrescriptionDraft } from '../controllers/aiController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/summary', authorize('doctor'), getClinicalSummary);
router.post('/prescription-draft', authorize('doctor'), createPrescriptionDraft);

export default router;