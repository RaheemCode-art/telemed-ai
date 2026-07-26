import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { generatePatientSummary, generatePrescriptionDraft } from '../services/aiService';

export const getClinicalSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { symptoms, medicalHistory } = req.body;

    if (!symptoms) {
      res.status(400).json({ message: 'Symptoms are required to generate summary' });
      return;
    }

    const summary = await generatePatientSummary(symptoms, medicalHistory || []);
    res.status(200).json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createPrescriptionDraft = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { diagnosis, notes } = req.body;

    if (!diagnosis) {
      res.status(400).json({ message: 'Diagnosis is required to generate draft' });
      return;
    }

    const draft = await generatePrescriptionDraft(diagnosis, notes || '');
    res.status(200).json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};