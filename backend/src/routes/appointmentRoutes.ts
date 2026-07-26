import express from 'express';
import { createAppointment, getMyAppointments, updateAppointmentStatus } from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('patient'), createAppointment)
  .get(getMyAppointments);

router.route('/:id/status')
  .put(authorize('doctor'), updateAppointmentStatus);

export default router;