'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';

export default function BookingPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('10:00 AM');
  const [type, setType] = useState<string>('Text Chat Only');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');
        let res;
        try {
          res = await api.get('/users?role=doctor');
        } catch {
          res = await api.get('/admin/users');
        }

        const allUsers = res.data || [];
        const doctorList = allUsers.filter((u: any) => u.role === 'doctor');
        setDoctors(doctorList);

        if (doctorList.length > 0) {
          setSelectedDoctor(doctorList[0]._id);
        }
      } catch (err: any) {
        setError('Failed to load active specialists from server. Please check your network or login session.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setError('Please select a medical practitioner to proceed.');
      return;
    }
    if (!appointmentDate) {
      setError('Please select a valid appointment date.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await api.post('/appointments', {
        doctorId: selectedDoctor,
        appointmentDate,
        appointmentTime,
        type,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please ensure your onboarding profile is completed.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDocObj = doctors.find((d) => d._id === selectedDoctor);

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book a Consultation</h1>
        <p className="text-sm text-slate-500 mt-1">Select an available specialist and schedule your real-time session.</p>
      </header>

      {success ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm my-12">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Consultation Scheduled</h2>
          <p className="text-sm text-slate-500 mt-2">Your appointment has been confirmed. Redirecting to your portal...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleBooking} className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">1. Select Medical Specialist</label>
              {loading ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span className="text-xs font-medium text-slate-400">Loading available specialists...</span>
                </div>
              ) : doctors.length === 0 ? (
                <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-xs font-medium flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600" />
                  <span>No active doctors available in the database. Please ask an Admin to create a Doctor account first.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctor === doc._id;
                    return (
                      <div
                        key={doc._id}
                        onClick={() => setSelectedDoctor(doc._id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
                          isSelected ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {doc.firstName?.[0] || 'D'}{doc.lastName?.[0] || ''}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">Dr. {doc.firstName} {doc.lastName}</h4>
                          <p className="text-xs text-slate-500 font-medium capitalize truncate">{doc.specialty || 'General Practitioner'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Appointment Date</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Time Slot</label>
                <div className="relative">
                  <select
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 appearance-none"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Session Mode</label>
              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                Real-time Text Consultation
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || doctors.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-[0.99] text-white font-bold py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm mt-4"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming Session...</span>
                </>
              ) : (
                <>
                  <span>Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <aside className="bg-slate-50 rounded-3xl border border-slate-200 p-6 h-fit space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200/80 pb-4">Booking Summary</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Practitioner:</span>
                <span className="font-bold text-slate-900">
                  {selectedDocObj ? `Dr. ${selectedDocObj.firstName} ${selectedDocObj.lastName}` : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Specialty:</span>
                <span className="font-bold text-blue-600 capitalize">{selectedDocObj?.specialty || 'General Practice'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Session Mode:</span>
                <span className="font-bold text-slate-900">{type}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200/60 pt-3">
                <span className="text-slate-500 font-medium">Date:</span>
                <span className="font-bold text-slate-900">{appointmentDate || 'Select Date'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Time Slot:</span>
                <span className="font-bold text-slate-900">{appointmentTime}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800 text-[11px] leading-relaxed font-medium">
              Ensure your medical onboarding profile is fully complete before session commencement.
            </div>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}