'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Search, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  Activity, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import api from '@/lib/axios';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  gender?: string;
  completedOnboarding: boolean;
  createdAt: string;
}

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty?: string;
  createdByAdmin?: boolean;
  activeStatus?: boolean;
  createdAt: string;
}

interface Appointment {
  _id: string;
  patientId?: { firstName: string; lastName: string; email: string };
  doctorId?: { firstName: string; lastName: string; specialty: string };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'appointments'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [docForm, setDocForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: 'Cardiology',
    password: '',
  });
  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');
  const [createSuccess, setCreateSuccess] = useState<string>('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'patients') {
        const res = await api.get('/users?role=patient');
        setPatients(res.data || []);
      } else if (activeTab === 'doctors') {
        const res = await api.get('/users?role=doctor');
        setDoctors(res.data || []);
      } else if (activeTab === 'appointments') {
        const res = await api.get('/appointments');
        setAppointments(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await api.post('/admin/create-doctor', docForm);
      setCreateSuccess(`Dr. ${docForm.firstName} ${docForm.lastName} created successfully!`);
      setDocForm({ firstName: '', lastName: '', email: '', specialty: 'Cardiology', password: '' });
      setTimeout(() => {
        setIsModalOpen(false);
        setCreateSuccess('');
        if (activeTab === 'doctors') fetchAdminData();
      }, 1500);
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create doctor account.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = doctors.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.specialty && d.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAppointments = appointments.filter(a => 
    a.patientId && `${a.patientId.firstName} ${a.patientId.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.doctorId && `${a.doctorId.firstName} ${a.doctorId.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">TeleMed System Admin</h1>
              <p className="text-xs text-slate-400">System surveillance and network onboarding portal</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <nav className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('patients')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'patients' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patients ({patients.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'doctors' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Doctors ({doctors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                activeTab === 'appointments' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments ({appointments.length})</span>
            </button>
          </nav>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search active view..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Doctor Account</span>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-xs font-medium text-slate-400">Loading directory records...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    {activeTab === 'patients' && (
                      <>
                        <th className="py-4 px-6">Age / Gender</th>
                        <th className="py-4 px-6">Onboarding</th>
                      </>
                    )}
                    {activeTab === 'doctors' && (
                      <>
                        <th className="py-4 px-6">Specialty</th>
                        <th className="py-4 px-6">Creation Method</th>
                        <th className="py-4 px-6">Auth Status</th>
                      </>
                    )}
                    {activeTab === 'appointments' && (
                      <>
                        <th className="py-4 px-6">Practitioner</th>
                        <th className="py-4 px-6">Date & Time</th>
                        <th className="py-4 px-6">Status</th>
                      </>
                    )}
                    <th className="py-4 px-6">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {activeTab === 'patients' && filteredPatients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">{p.firstName} {p.lastName}</td>
                      <td className="py-4 px-6 text-slate-600">{p.email}</td>
                      <td className="py-4 px-6 text-slate-600">
                        {p.age ? `${p.age} yrs • ${p.gender || 'N/A'}` : 'Not specified'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          p.completedOnboarding ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {p.completedOnboarding ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}

                  {activeTab === 'doctors' && filteredDoctors.map((d) => (
                    <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {d.firstName.startsWith('Dr.') ? `${d.firstName} ${d.lastName}` : `Dr. ${d.firstName} ${d.lastName}`}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{d.email}</td>
                      <td className="py-4 px-6 font-bold text-blue-600 capitalize">{d.specialty || 'General Practice'}</td>
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-semibold">
                          {d.createdByAdmin ? 'Admin Created' : 'Self Registered'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-bold">
                          Verified
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}

                  {activeTab === 'appointments' && filteredAppointments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {a.patientId ? `${a.patientId.firstName} ${a.patientId.lastName}` : 'Unknown Patient'}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {a.doctorId ? `Dr. ${a.doctorId.firstName} ${a.doctorId.lastName}` : 'Assigned Doctor'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{a.appointmentDate} at {a.appointmentTime}</td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase">
                          {a.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(activeTab === 'patients' && filteredPatients.length === 0) ||
               (activeTab === 'doctors' && filteredDoctors.length === 0) ||
               (activeTab === 'appointments' && filteredAppointments.length === 0) ? (
                <div className="p-12 text-center text-slate-400 text-xs font-medium">
                  No records found matching your active filter criteria.
                </div>
              ) : null}
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-md p-6 sm:p-8 shadow-xl space-y-6">
            <header className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Provision Doctor Account</h3>
                <p className="text-xs text-slate-500">Create login credentials for a new clinical provider.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </header>

            {createError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            {createSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{createSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateDoctor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ali"
                    value={docForm.firstName}
                    onChange={(e) => setDocForm({ ...docForm, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Khan"
                    value={docForm.lastName}
                    onChange={(e) => setDocForm({ ...docForm, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ali.khan@telemed.org"
                  value={docForm.email}
                  onChange={(e) => setDocForm({ ...docForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Specialty</label>
                <select
                  value={docForm.specialty}
                  onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Practice">General Practice</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase">Temporary Password</label>
                <input
                  type="password"
                  required
                  placeholder="Assign a temporary secure password"
                  value={docForm.password}
                  onChange={(e) => setDocForm({ ...docForm, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl shadow-sm transition-all text-xs mt-2"
              >
                {creating ? 'Provisioning Account...' : 'Create Practitioner Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}