'use client';

import React, { useState } from 'react';
import { Search, Plus, FileText, Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-9021',
      patient: 'Eleanor Vance',
      medication: 'Metformin HCL',
      dosage: '1000mg',
      frequency: 'BID w/ meals',
      issuedDate: 'Oct 24, 2023',
      status: 'Active',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'RX-8812',
      patient: 'Sarah Jenkins',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Daily AM',
      issuedDate: 'Oct 23, 2023',
      status: 'Refill Requested',
      statusColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'RX-7743',
      patient: 'Marcus Rodriguez',
      medication: 'Amiodarone',
      dosage: '200mg',
      frequency: 'Daily',
      issuedDate: 'Oct 15, 2023',
      status: 'Active',
      statusColor: 'bg-emerald-100 text-emerald-800',
    },
  ]);

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            E-Prescriptions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Issue digital prescriptions and review medication refill requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-200 font-semibold py-2.5 px-4 rounded-xl hover:bg-blue-100 transition-all text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Draft Generator</span>
          </button>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-all">
            <Plus className="w-4 h-4" />
            <span>New Prescription</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">24</div>
            <div className="text-xs font-semibold text-slate-500">Active Prescriptions</div>
          </div>
        </article>

        <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">3</div>
            <div className="text-xs font-semibold text-slate-500">Pending Refills</div>
          </div>
        </article>

        <article className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">98%</div>
            <div className="text-xs font-semibold text-slate-500">Adherence Rate</div>
          </div>
        </article>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Dispensations</h2>
          <span className="text-xs font-semibold text-slate-400">Showing latest records</span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">RX ID</th>
                <th className="py-4 px-6">Patient Name</th>
                <th className="py-4 px-6">Medication & Dosage</th>
                <th className="py-4 px-6">Frequency</th>
                <th className="py-4 px-6">Issued Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    #{rx.id}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {rx.patient}
                  </td>
                  <td className="py-4 px-6 font-bold text-blue-600">
                    {rx.medication} <span className="text-slate-500 font-normal">({rx.dosage})</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {rx.frequency}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                    {rx.issuedDate}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${rx.statusColor}`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all">
                      Review
                    </button>
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