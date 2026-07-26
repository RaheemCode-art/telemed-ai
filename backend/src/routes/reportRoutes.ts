import express from 'express';
import { uploadAndSummarizeReport, getMyReports } from '../controllers/reportController';
import { protect, authorize } from '../middleware/authMiddleware';
import { uploadPDF } from '../services/fileService';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('patient'), uploadPDF.single('report'), uploadAndSummarizeReport)
  .get(authorize('patient', 'doctor'), getMyReports);

export default router;