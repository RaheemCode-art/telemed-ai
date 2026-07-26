import { Response } from 'express';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { doctorId, appointmentDate, appointmentTime, type, notes } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user?._id,
      doctorId,
      appointmentDate,
      appointmentTime,
      type: type || 'Video Consult',
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let appointments;

    if (req.user?.role === 'doctor') {
      appointments = await Appointment.find({ doctorId: req.user._id })
        .populate('patientId', 'firstName lastName email activeConditions')
        .sort({ createdAt: -1 });
    } else {
      appointments = await Appointment.find({ patientId: req.user?._id })
        .populate('doctorId', 'firstName lastName specialty institution')
        .sort({ createdAt: -1 });
    }

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, prescription, notes } = req.body;
    const { id } = req.params;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ message: 'Appointment not found' });
      return;
    }

    appointment.status = status || appointment.status;
    appointment.prescription = prescription || appointment.prescription;
    appointment.notes = notes || appointment.notes;

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};