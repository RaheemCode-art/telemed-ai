import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalReport extends Document {
  patientId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  fileType: string;
  aiSummary: string;
  uploadStatus: 'Uploaded' | 'Processing' | 'Completed' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
}

const MedicalReportSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, default: 'application/pdf' },
    aiSummary: { type: String, default: '' },
    uploadStatus: {
      type: String,
      enum: ['Uploaded', 'Processing', 'Completed', 'Failed'],
      default: 'Uploaded',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMedicalReport>('MedicalReport', MedicalReportSchema);