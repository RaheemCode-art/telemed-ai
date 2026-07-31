import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'patient' | 'doctor' | 'admin';
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  allergies?: string[];
  currentMedications?: string[];
  preExistingConditions?: string[];
  emergencyContact?: string;
  completedOnboarding: boolean;
  specialty?: string;
  licenseNumber?: string;
  institution?: string;
  bio?: string;
  activeStatus?: boolean;
  createdByAdmin?: boolean;
  inviteToken?: string;
  tempPasswordStatus?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    age: { type: Number },
    gender: { type: String },
    weight: { type: Number },
    height: { type: Number },
    allergies: [{ type: String }],
    currentMedications: [{ type: String }],
    preExistingConditions: [{ type: String }],
    emergencyContact: { type: String },
    completedOnboarding: { type: Boolean, default: false },
    specialty: { type: String },
    licenseNumber: { type: String },
    institution: { type: String },
    bio: { type: String },
    activeStatus: { type: Boolean, default: true },
    createdByAdmin: { type: Boolean, default: false },
    inviteToken: { type: String },
    tempPasswordStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);