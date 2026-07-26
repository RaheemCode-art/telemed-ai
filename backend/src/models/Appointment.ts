import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  status: 'CONFIRMED' | 'PENDING' | 'IN WAITING ROOM' | 'COMPLETED';
  type: 'Video Consult' | 'Secure Chat';
  notes?: string;
  prescription?: string;
}

const AppointmentSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    duration: { type: Number, default: 15 },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'IN WAITING ROOM', 'COMPLETED'],
      default: 'PENDING',
    },
    type: {
      type: String,
      enum: ['Video Consult', 'Secure Chat'],
      default: 'Video Consult',
    },
    notes: { type: String },
    prescription: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);