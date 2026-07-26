'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, FileText, Clock, Stethoscope, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.role);
    } else {
      router.replace('/login');
    }
  }, [router]);

  const fetchDashboardData = async (role: string) => {
    try {
      setLoading(true);
      const appRes = await api.get('/appointments');
      setAppointments(appRes.data || []);

      if (role === 'patient') {
        const repRes = await api.get('/reports');
        setReports(repRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (user.role === 'patient') {
    return (
      <DashboardLayout>
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good Morning, {user.firstName || user.name}</h1>
            <p className="text-sm text-slate-500 mt-1">Welcome to your Personal Patient Portal. Here is your healthcare summary.</p>
          </div>
          <button
            onClick={() => router.push('/booking')}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 w-fit"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Book New Consultation</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Appointments</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{appointments.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical Reports</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{reports.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Status</p>
              <h3 className="text-sm font-bold text-emerald-600 mt-1">Onboarding Complete</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Consultations</h2>
              <button onClick={() => router.push('/booking')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No appointments scheduled.</p>
                <p className="text-xs text-slate-400 mt-1">Book a session with a specialist to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.slice(0, 4).map((app) => (
                  <div key={app._id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {app.doctorId?.firstName?.[0] || 'D'}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">Dr. {app.doctorId?.firstName} {app.doctorId?.lastName}</h4>
                        <p className="text-xs text-slate-500">{app.appointmentDate} at {app.appointmentTime}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent AI Summarized Reports</h2>
              <button onClick={() => router.push('/reports')} className="text-xs font-bold text-blue-600 hover:underline">Upload New</button>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">No medical reports uploaded yet.</p>
                <p className="text-xs text-slate-400 mt-1">Upload PDF reports to receive instant AI simplifications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.slice(0, 3).map((rep) => (
                  <div key={rep._id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 truncate max-w-[200px]">{rep.fileName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">{rep.uploadStatus}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{rep.aiSummary || 'Summary processing...'}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Doctor Clinical Workspace</h1>
        <p className="text-sm text-slate-500 mt-1">Review scheduled consultations, active patient queues, and clinical summaries.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Consultations</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{appointments.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Status</p>
            <h3 className="text-sm font-bold text-emerald-600 mt-1">Available for Call</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Session</p>
            <h3 className="text-sm font-bold text-slate-900 mt-1">Check Schedule</h3>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Assigned Patient Consultations</h2>

        {appointments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No patient consultations assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div key={app._id} className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {app.patientId?.firstName?.[0] || 'P'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Patient: {app.patientId?.firstName} {app.patientId?.lastName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Scheduled for: <span className="font-semibold text-slate-700">{app.appointmentDate} at {app.appointmentTime}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/consultation?id=${app._id}`)}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-all w-fit sm:w-auto"
                >
                  Open Consultation Room
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}