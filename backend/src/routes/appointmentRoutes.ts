import express from 'express';
import { createAppointment, getMyAppointments, updateAppointmentStatus } from '../controllers/appointmentController';
import { protect, authorize, requireOnboarding } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(authorize('patient'), requireOnboarding, createAppointment)
  .get(getMyAppointments);

router.route('/:id/status')
  .put(authorize('doctor', 'admin'), updateAppointmentStatus);

export default router;