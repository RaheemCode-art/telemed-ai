import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(` MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Database Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;