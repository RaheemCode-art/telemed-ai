import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import MedicalReport from '../models/MedicalReport';
import { extractTextFromPDF } from '../services/fileService';
import { generatePatientReportSummary } from '../services/aiService';

export const uploadAndSummarizeReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
      res.status(400).json({ message: 'Only PDF medical reports are permitted for upload' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const report = await MedicalReport.create({
      patientId: req.user?._id,
      fileName: req.file.originalname,
      fileUrl,
      fileType: req.file.mimetype,
      uploadStatus: 'Processing',
    });

    try {
      const extractedText = await extractTextFromPDF(req.file.path);
      const aiSummary = await generatePatientReportSummary(extractedText);
      
      report.aiSummary = aiSummary;
      report.uploadStatus = 'Completed';
    } catch (aiError) {
      report.aiSummary = 'AI summary generation failed. Please consult your doctor directly to review the original uploaded PDF document.';
      report.uploadStatus = 'Failed';
      console.error('PDF AI Processing Error Hacked:', aiError); // YEH LINE ADD KARO
    }

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: any = {};

    if (req.user?.role === 'patient') {
      query.patientId = req.user._id;
    } else if ((req.user?.role === 'doctor' || req.user?.role === 'admin') && req.query.patientId) {
      query.patientId = req.query.patientId;
    }

    const reports = await MedicalReport.find(query).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};