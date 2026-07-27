import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/authMiddleware';

export const createDoctorAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, specialty, bio, password } = req.body;

    if (!firstName || !lastName || !email) {
      res.status(400).json({ message: 'First name, last name, and email are required' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: cleanEmail });
    
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const tempPassword = password || Math.random().toString(36).slice(-8) + 'A1!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const formattedFirstName = firstName.startsWith('Dr.') ? firstName : `Dr. ${firstName}`;

    const doctor = await User.create({
      firstName: formattedFirstName,
      lastName,
      email: cleanEmail,
      password: hashedPassword,
      role: 'doctor',
      specialty: specialty || 'General Practice',
      bio: bio || 'Network verified medical practitioner.',
      activeStatus: true,
      createdByAdmin: true,
      tempPasswordStatus: true,
      completedOnboarding: true,
    });

    res.status(201).json({
      _id: doctor._id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      role: doctor.role,
      specialty: doctor.specialty,
      tempPassword,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createDoctor = createDoctorAccount;

export const getAdminOverviewData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password').sort({ createdAt: -1 });
    const doctors = await User.find({ role: 'doctor' }).select('-password').sort({ createdAt: -1 });
    const appointments = await Appointment.find()
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ createdAt: -1 });

    res.status(200).json({ patients, doctors, appointments });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUsers = getAllUsers;

export const getAllAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAppointments = getAllAppointments;