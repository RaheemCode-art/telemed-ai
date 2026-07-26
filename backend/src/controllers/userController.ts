import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/User';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};