'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (file.type !== 'application/pdf') {
      setError('Only PDF medical reports are permitted in the MVP.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('report', file);

    try {
      await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchReports();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload and summarize PDF report.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Medical Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload PDF clinical laboratory reports to generate simplified AI explanations.
          </p>
        </div>

        <label className={`cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-sm text-sm transition-all shrink-0 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Processing AI Summary...' : 'Upload PDF Report'}</span>
          <input type="file" accept="application/pdf" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </header>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
          {error}
        </div>
      )}

      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">AI Patient Summary Engine</h2>
            <p className="text-xs text-slate-500">Powered by Google Gemini 2.5 Flash • Patient-friendly translation model</p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
          Disclaimer: AI summaries are generated for informational and educational purposes only. They do not constitute formal medical diagnosis or replace consultation with a qualified physician.
        </div>
      </section>

      <section className="space-y-6">
        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <div className="font-bold text-slate-600">No medical reports uploaded yet</div>
            <div className="text-xs mt-1">Click the upload button above to submit your first PDF document.</div>
          </div>
        ) : (
          reports.map((report) => (
            <article key={report._id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <header className="p-6 bg-slate-50/75 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{report.fileName}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">Uploaded on {new Date(report.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {report.uploadStatus === 'Completed' && (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  )}
                  {report.uploadStatus === 'Processing' && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Processing</span>
                    </span>
                  )}
                  {report.uploadStatus === 'Failed' && (
                    <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}

                  <a
                    href={`http://localhost:5000${report.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-sm transition-all"
                  >
                    <span>View PDF</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </header>

              <div className="p-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Simplified Clinical Explanation</span>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-blue-50/30 p-5 rounded-2xl border border-blue-100/60 font-medium">
                  {report.aiSummary || 'AI analysis is currently being generated. Please refresh the page in a few moments.'}
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </DashboardLayout>
  );
}