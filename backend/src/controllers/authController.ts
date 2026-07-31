import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role, specialty, licenseNumber, institution, bio } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'patient',
      specialty,
      licenseNumber,
      institution,
      bio,
      completedOnboarding: false,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      completedOnboarding: user.completedOnboarding,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      completedOnboarding: user.completedOnboarding,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const {
      age,
      gender,
      weight,
      height,
      allergies,
      currentMedications,
      preExistingConditions,
      emergencyContact,
      completedOnboarding,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (weight !== undefined) user.weight = weight;
    if (height !== undefined) user.height = height;
    if (allergies !== undefined) user.allergies = allergies;
    if (currentMedications !== undefined) user.currentMedications = currentMedications;
    if (preExistingConditions !== undefined) user.preExistingConditions = preExistingConditions;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (completedOnboarding !== undefined) user.completedOnboarding = completedOnboarding;

    await user.save();

    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      age: user.age,
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      allergies: user.allergies,
      currentMedications: user.currentMedications,
      preExistingConditions: user.preExistingConditions,
      emergencyContact: user.emergencyContact,
      completedOnboarding: user.completedOnboarding,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};