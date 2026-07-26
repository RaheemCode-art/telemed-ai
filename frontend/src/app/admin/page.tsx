'use client';
import AuthGuard from '@/components/AuthGuard';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, UserCheck, Calendar, Plus, Search, LogOut, Copy, Check, AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'appointments'>('patients');
  const [data, setData] = useState<{ patients: any[]; doctors: any[]; appointments: any[] }>({
    patients: [],
    doctors: [],
    appointments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: 'Cardiology',
    bio: '',
  });
  const [creating, setCreating] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState<{ email: string; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/overview');
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch system overview data. Verify admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role !== 'admin') {
            router.push('/dashboard');
            return;
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        router.push('/login');
        return;
      }
    }
    fetchAdminData();
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const res = await api.post('/admin/create-doctor', docForm);
      setGeneratedCreds({
        email: res.data.email,
        tempPassword: res.data.tempPassword,
      });
      setDocForm({ firstName: '', lastName: '', email: '', specialty: 'Cardiology', bio: '' });
      await fetchAdminData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create doctor account.');
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const filteredPatients = data.patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoctors = data.doctors.filter((d) =>
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.specialty && d.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAppointments = data.appointments.filter((a) =>
    a._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.patientId && `${a.patientId.firstName} ${a.patientId.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.doctorId && `${a.doctorId.firstName} ${a.doctorId.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
  
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-lg text-white shadow-md">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">TeleMed System Admin</span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Read-Only Monitor
                </span>
              </div>
              <p className="text-xs text-slate-400">System surveillance and network onboarding portal</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit">
            <button
              onClick={() => setActiveTab('patients')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'patients' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patients ({data.patients.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'doctors' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Doctors ({data.doctors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'appointments' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>System Logs ({data.appointments.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search active view..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <button
              onClick={() => { setIsModalOpen(true); setGeneratedCreds(null); }}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm text-xs transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Doctor Account</span>
            </button>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm font-semibold">
              Loading encrypted system metrics...
            </div>
          ) : (
            <>
              {activeTab === 'patients' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Age / Gender</th>
                        <th className="py-4 px-6">Onboarding</th>
                        <th className="py-4 px-6">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredPatients.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-bold text-slate-900">{p.firstName} {p.lastName}</td>
                          <td className="py-4 px-6 text-slate-600">{p.email}</td>
                          <td className="py-4 px-6">{p.age || '-'} yrs • {p.gender || '-'}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.completedOnboarding ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {p.completedOnboarding ? 'Completed' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'doctors' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6">Specialty</th>
                        <th className="py-4 px-6">Creation Method</th>
                        <th className="py-4 px-6">Auth Status</th>
                        <th className="py-4 px-6">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredDoctors.map((d) => (
                        <tr key={d._id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-bold text-slate-900">{d.firstName} {d.lastName}</td>
                          <td className="py-4 px-6 text-slate-600">{d.email}</td>
                          <td className="py-4 px-6 font-semibold text-blue-600">{d.specialty || 'General Practice'}</td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-200">
                              {d.createdByAdmin ? 'Admin Created' : 'Self Registered'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.tempPasswordStatus ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {d.tempPasswordStatus ? 'Temp Password Active' : 'Verified'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-slate-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-4 px-6">Consultation ID</th>
                        <th className="py-4 px-6">Patient</th>
                        <th className="py-4 px-6">Doctor</th>
                        <th className="py-4 px-6">Schedule</th>
                        <th className="py-4 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                      {filteredAppointments.map((a) => (
                        <tr key={a._id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-6 font-bold text-slate-900">#{a._id.slice(-8).toUpperCase()}</td>
                          <td className="py-4 px-6 font-semibold">{a.patientId ? `${a.patientId.firstName} ${a.patientId.lastName}` : 'N/A'}</td>
                          <td className="py-4 px-6 font-semibold text-blue-600">{a.doctorId ? `${a.doctorId.firstName} ${a.doctorId.lastName}` : 'N/A'}</td>
                          <td className="py-4 px-6">{a.appointmentDate} • {a.appointmentTime}</td>
                          <td className="py-4 px-6">
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-bold text-[10px]">
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <header className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Create Doctor Account</h3>
                <p className="text-xs text-slate-500 mt-0.5">Admin network onboarding workflow</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </header>

            {generatedCreds ? (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Account Created Successfully!</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    Provide these credentials to the physician. The system has applied a temporary password that requires verification upon initial login.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-sans">Login Email:</span>
                    <span className="font-bold text-white">{generatedCreds.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans">Temp Password:</span>
                    <span className="font-bold text-amber-400 text-sm">{generatedCreds.tempPassword}</span>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(`Email: ${generatedCreds.email}\nPassword: ${generatedCreds.tempPassword}`)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-300"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Credentials Copied to Clipboard!' : 'Copy Credentials'}</span>
                </button>

                <button
                  onClick={() => { setIsModalOpen(false); setGeneratedCreds(null); }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all"
                >
                  Done & Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateDoctor} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">First Name</label>
                    <input
                      type="text"
                      required
                      value={docForm.firstName}
                      onChange={(e) => setDocForm({ ...docForm, firstName: e.target.value })}
                      placeholder="John"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase">Last Name</label>
                    <input
                      type="text"
                      required
                      value={docForm.lastName}
                      onChange={(e) => setDocForm({ ...docForm, lastName: e.target.value })}
                      placeholder="Smith, MD"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={docForm.email}
                    onChange={(e) => setDocForm({ ...docForm, email: e.target.value })}
                    placeholder="doctor@hospital.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Medical Specialty</label>
                  <select
                    value={docForm.specialty}
                    onChange={(e) => setDocForm({ ...docForm, specialty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">Professional Bio</label>
                  <textarea
                    rows={3}
                    value={docForm.bio}
                    onChange={(e) => setDocForm({ ...docForm, bio: e.target.value })}
                    placeholder="Enter network credentials and clinical background..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all mt-4 disabled:opacity-70"
                >
                  {creating ? 'Generating Secure Credentials...' : 'Create & Generate Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}