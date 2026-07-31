import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePatientSummary = async (symptoms: string, medicalHistory: string[]): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const prompt = `Act as a clinical AI assistant. Summarize patient reports into a concise, 3-bullet clinical overview for a doctor.\nSymptoms: ${symptoms}\nMedical History: ${medicalHistory.join(', ')}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Unable to generate summary at this time.';
  } catch (error) {
    throw new Error(`AI Summary Error: ${(error as Error).message}`);
  }
};

export const generatePrescriptionDraft = async (diagnosis: string, notes: string): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const prompt = `Act as a clinical AI assistant. Create a professional, standardized E-Prescription draft based on diagnosis and doctor notes. Include sections for Medications, Dosage Instructions, and Follow-up advice.\nDiagnosis: ${diagnosis}\nDoctor Notes: ${notes}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Unable to generate prescription draft.';
  } catch (error) {
    throw new Error(`AI Prescription Error: ${(error as Error).message}`);
  }
};

export const generatePatientReportSummary = async (reportText: string): Promise<string> => {
  try {
    if (!reportText || reportText.trim().length === 0) {
      throw new Error('No readable text found in the uploaded document.');
    }

    const sanitizedText = reportText.slice(0, 15000);
    const ai = getGeminiClient();

    const prompt = `Act as a medical assistant. Explain this medical report in simple, easy-to-understand language for a patient. Avoid complex terminology and summarize key findings, possible concerns, and general meaning.\n\n=== BEGIN REPORT CONTENT ===\n${sanitizedText}\n=== END REPORT CONTENT ===`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const result = response.text;
    if (!result) {
      return 'Summary generation unavailable at this time.';
    }

    const disclaimer = "\n\nDisclaimer: This AI summary is generated for informational purposes only and does not constitute medical advice or replace consultation with a qualified physician.";

    return result.includes('Disclaimer') ? result : result + disclaimer;
  } catch (error) {
    throw new Error(`AI Summarization Error: ${(error as Error).message}`);
  }
};