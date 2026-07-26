'use client';

import React, { useState } from 'react';
import { Search, FileText, Download, Eye, Sparkles, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const records = [
    {
      id: 'REC-1092',
      patient: 'Eleanor Vance',
      patientId: 'PT-8842',
      type: 'AI Clinical Summary & Transcript',
      date: 'Oct 24, 2023',
      doctor: 'Dr. Smith',
      diagnosis: 'Type 2 Diabetes Hyperglycemia',
      status: 'Verified',
      statusColor: 'bg-emerald-100 text-emerald-800',
      isAiGenerated: true,
    },
    {
      id: 'REC-1088',
      patient: 'Sarah Jenkins',
      patientId: 'PT-5120',
      type: 'Echocardiogram Follow-up Report',
      date: 'Oct 23, 2023',
      doctor: 'Dr. Smith',
      diagnosis: 'Mild Hypertension',
      status: 'Verified',
      statusColor: 'bg-emerald-100 text-emerald-800',
      isAiGenerated: false,
    },
    {
      id: 'REC-1075',
      patient: 'Marcus Rodriguez',
      patientId: 'PT-9931',
      type: 'Cardiovascular Risk Assessment',
      date: 'Oct 22, 2023',
      doctor: 'Dr. Smith',
      diagnosis: 'Arrhythmia Monitoring',
      status: 'Pending Sign-off',
      statusColor: 'bg-amber-100 text-amber-800',
      isAiGenerated: true,
    },
    {
      id: 'REC-1064',
      patient: 'Arthur Pendelton',
      patientId: 'PT-8492',
      type: 'Post-op Discharge Summary',
      date: 'Oct 20, 2023',
      doctor: 'Dr. Smith',
      diagnosis: 'Stable Recovery',
      status: 'Archived',
      statusColor: 'bg-slate-100 text-slate-700',
      isAiGenerated: false,
    },
  ];

  const filteredRecords = records.filter((r) =>
    r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Medical Records
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access encrypted patient encounter summaries and AI clinical transcripts.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-all shrink-0">
          + Upload Clinical Record
        </button>
      </header>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records by patient name, record ID, or diagnosis..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Filter Type</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Encounters Archive</h2>
          <span className="text-xs font-semibold text-slate-400">HIPAA Protected Storage</span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Record ID</th>
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-6">Document Type</th>
                <th className="py-4 px-6">Diagnosis / Finding</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    #{rec.id}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">{rec.patient}</div>
                    <div className="text-xs text-slate-400 font-medium">{rec.patientId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {rec.isAiGenerated && (
                        <span className="p-1 rounded bg-blue-50 text-blue-600" title="AI Generated">
                          <Sparkles className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className="font-semibold text-slate-800">{rec.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {rec.diagnosis}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                    {rec.date}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${rec.statusColor}`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Document">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}