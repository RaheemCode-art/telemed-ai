'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowRight, Stethoscope } from 'lucide-react';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: 'patient',
      };

      const response = await api.post('/auth/register', payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      router.push('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-2 font-sans text-slate-800">
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 font-black">
              T
            </div>
            <span>TeleMed AI</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Join the leading digital clinical network.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Patients can instantly register to upload medical reports and consult practitioners, while doctors are onboarded securely through administrative channels[cite: 1].
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3.5 rounded-2xl shadow-sm w-full">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">Patient Portal Access</div>
              <div className="text-xs text-slate-400">Direct registration is strictly reserved for patient onboarding[cite: 1].</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-3 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 px-5 py-3.5 rounded-2xl shadow-sm w-full">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-purple-200">Are you a Medical Provider?</div>
              <div className="text-xs text-purple-300/80">Doctor accounts are created and provisioned exclusively by System Administrators[cite: 1].</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-12 min-w-0 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 my-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Patient Registration
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Create your personal portal to upload reports and book real-time consultations[cite: 1].
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div className="text-xs text-purple-900 leading-relaxed font-medium">
              <span className="font-bold">Doctor Notice:</span> Medical practitioner accounts cannot be self-registered[cite: 1]. Please contact the System Administrator to receive your secure invite link or activation credentials[cite: 1].
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Abdul Raheem"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Kandhro"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="raheem@patient.org"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secure Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Must be at least 8 characters"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Register as Patient'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Already registered? </span>
            <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 ml-1">
              Sign in here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}