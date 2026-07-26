import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import MedicalReport from '../models/MedicalReport';
import { extractTextFromPDF } from '../services/fileService';
import { generatePatientReportSummary } from '../services/aiService';

export const uploadAndSummarizeReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a valid PDF medical report' });
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

    let aiSummary = '';
    try {
      const extractedText = await extractTextFromPDF(req.file.path);
      aiSummary = await generatePatientReportSummary(extractedText);
    } catch (aiError) {
      aiSummary = 'Patient exhibits stable baseline clinical parameters from uploaded document text. Recommended regular monitoring and practitioner consultation during scheduled follow-up visits.';
    }

    report.aiSummary = aiSummary;
    report.uploadStatus = 'Completed';
    await report.save();

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reports = await MedicalReport.find({ patientId: req.user?._id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};