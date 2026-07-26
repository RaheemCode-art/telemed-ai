import { GoogleGenAI } from '@google/genai';

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePatientSummary = async (symptoms: string, medicalHistory: string[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const prompt = `Act as a clinical AI assistant. Summarize the following patient reports into a concise, 3-bullet clinical overview for a doctor.
    Symptoms: ${symptoms}
    Medical History: ${medicalHistory.join(', ')}`;

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
    const ai = getAIClient();
    const prompt = `Act as a clinical AI assistant. Create a professional, standardized E-Prescription draft based on this diagnosis and doctor notes. Include sections for Medications, Dosage Instructions, and Follow-up advice.
    Diagnosis: ${diagnosis}
    Doctor Notes: ${notes}`;

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
    const ai = getAIClient();
    const prompt = `Act as a medical assistant. Explain this medical report in simple, easy-to-understand language for a patient. Avoid complex terminology and summarize key findings, possible concerns, and general meaning. Note: This summary is informational only and does not replace a doctor's opinion.
    
    Report Content:
    ${reportText.slice(0, 10000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || 'Summary generation unavailable at this time.';
  } catch (error) {
    throw new Error(`AI Summarization Error: ${(error as Error).message}`);
  }
};