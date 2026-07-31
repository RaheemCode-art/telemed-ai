import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  appointmentId: string;
  sender: string;
  text: string;
  timestamp: string;
}

const MessageSchema: Schema = new Schema(
  {
    appointmentId: { type: String, required: true },
    sender: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>('Message', MessageSchema);