'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, FileText, Video, MoreVertical, UserPlus, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPatients = async () => {
      try {
        setLoading(true);
        const res = await api.get('/appointments');
        const appointmentsData = res.data || [];

        const uniquePatientsMap = new Map();

        appointmentsData.forEach((app: any) => {
          if (app.patientId && app.patientId._id) {
            const pid = app.patientId._id;
            if (!uniquePatientsMap.has(pid)) {
              uniquePatientsMap.set(pid, {
                _id: pid,
                firstName: app.patientId.firstName || 'Unknown',
                lastName: app.patientId.lastName || 'Patient',
                email: app.patientId.email || 'No email provided',
                age: app.patientId.age || 'N/A',
                gender: app.patientId.gender || 'U',
                condition: app.patientId.activeConditions?.[0] || app.type || 'General Consultation',
                lastVisit: new Date(app.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }),
                status: app.status === 'Confirmed' ? 'Active Care' : app.status === 'Pending' ? 'Monitoring' : 'Stable',
                appointmentId: app._id
              });
            }
          }
        });

        setPatients(Array.from(uniquePatientsMap.values()));
      } catch (err: any) {
        setError('Failed to fetch clinical directory from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPatients();
  }, []);

  const filteredPatients = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <button
          onClick={() => router.push('/booking')}
          className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-all shrink-0 inline-flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Patient</span>
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

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No patient records found</p>
            <p className="text-xs text-slate-400 mt-1">Patients who book consultations with you will automatically appear here.</p>
          </div>
        ) : (
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
                  <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-slate-400 font-medium">ID: #{patient._id.slice(-6).toUpperCase()}</div>
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
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        patient.status === 'Active Care' ? 'bg-emerald-100 text-emerald-800' :
                        patient.status === 'Monitoring' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/records?patientId=${patient._id}`)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Records"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/consultation?id=${patient.appointmentId}`)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Start Consult"
                        >
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
        )}
      </section>
    </DashboardLayout>
  );
}