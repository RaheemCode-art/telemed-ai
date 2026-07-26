import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string || 'mongodb://127.0.0.1:27017/telemed-ai');
    
    const adminEmail = 'admin@telemed.org';
    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log('Admin account already exists! Email: admin@telemed.org | Password: adminpassword123');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpassword123', salt);

    await User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      completedOnboarding: true,
      activeStatus: true,
    });

    console.log('SUCCESS: Admin Account Created Successfully!');
    console.log('Email: admin@telemed.org');
    console.log('Password: adminpassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();