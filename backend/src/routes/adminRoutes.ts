import express from 'express';
import { createDoctorAccount, getAdminOverviewData } from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/create-doctor', createDoctorAccount);
router.get('/overview', getAdminOverviewData);

export default router;