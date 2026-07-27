import bcrypt from 'bcryptjs';
import User from '../models/User';

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin12345', salt);

      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@telemed.com',
        password: hashedPassword,
        role: 'admin',
        completedOnboarding: true,
      });

      console.log(' Default System Admin Seeded Successfully!');
      console.log(' Email: admin@telemed.com |  Password: admin12345');
    }
  } catch (error) {
    console.error(' Error seeding admin account:', error);
  }
};