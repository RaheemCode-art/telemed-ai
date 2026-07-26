'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, FileText, Video, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([
    {
      id: 'PT-8842',
      name: 'Eleanor Vance',
      gender: 'F',
      age: 42,
      condition: 'Type 2 Diabetes Mellitus',
      lastVisit: 'Oct 24, 2023',
      status: 'Active Care',
      statusColor: 'bg-emerald-100 text-emerald-800',
      avatarBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'PT-5120',
      name: 'Sarah Jenkins',
      gender: 'F',
      age: 35,
      condition: 'Hypertension Follow-up',
      lastVisit: 'Oct 23, 2023',
      status: 'Monitoring',
      statusColor: 'bg-blue-100 text-blue-800',
      avatarBg: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'PT-9931',
      name: 'Marcus Rodriguez',
      gender: 'M',
      age: 58,
      condition: 'Arrhythmia Assessment',
      lastVisit: 'Oct 22, 2023',
      status: 'Urgent Review',
      statusColor: 'bg-red-100 text-red-800',
      avatarBg: 'bg-rose-100 text-rose-600',
    },
    {
      id: 'PT-8492',
      name: 'Arthur Pendelton',
      gender: 'M',
      age: 64,
      condition: 'Post-op Cardiovascular',
      lastVisit: 'Oct 20, 2023',
      status: 'Stable',
      statusColor: 'bg-slate-100 text-slate-800',
      avatarBg: 'bg-amber-100 text-amber-700',
    },
  ]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Patients
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your clinical directory and view patient medical histories.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-all shrink-0">
          + Add New Patient
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
              placeholder="Search patients by name, ID, or condition..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Filter Status</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Patient Name & ID</th>
                <th className="py-4 px-6">Demographics</th>
                <th className="py-4 px-6">Primary Condition</th>
                <th className="py-4 px-6">Last Visit</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${patient.avatarBg}`}>
                        {patient.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{patient.name}</div>
                        <div className="text-xs text-slate-400 font-medium">ID: #{patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {patient.gender} • {patient.age} yrs
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800">
                    {patient.condition}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                    {patient.lastVisit}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${patient.statusColor}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Records">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Start Consult">
                        <Video className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                        <MoreVertical className="w-4 h-4" />
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