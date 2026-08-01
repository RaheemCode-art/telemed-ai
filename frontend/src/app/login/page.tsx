'use client';
import { Activity } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await api.post('/auth/login', { email, password });
    
    const userData = response.data.user || response.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    if (userData.role === 'patient') {
      if (userData.completedOnboarding === true || userData.completed_onboarding === true) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } else if (userData.role === 'doctor') {
      router.push('/dashboard');
    } else if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch (err: any) {
    setError(err.response?.data?.message || 'Invalid email or password');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-2 font-sans text-slate-800">
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-12 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-600 shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span>TeleMed AI</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Secure, integrated telehealth solutions for modern medical practitioners.
          </h1>
          <p className="text-blue-100/80 text-base leading-relaxed">
            Provide exceptional care from anywhere. Our HIPAA-compliant platform streamlines video consultations, clinical records, real-time AI transcription, and e-prescriptions.
          </p>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 px-5 py-3.5 rounded-2xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm text-white">HIPAA Compliant Secure Portal</div>
              <div className="text-xs text-blue-200">End-to-end  encryption for all clinical sessions.</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-12 lg:p-16 min-w-0">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
          <div>
            <div className="lg:hidden flex items-center gap-2 text-lg font-bold text-blue-600 mb-6">
              <span>TeleMed Professional</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign in to Provider Portal
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Access your clinical dashboard, active appointments, and patient records.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Secure Password
                </label>
                <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {/* <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              /> */}
              {/* <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
                Remember this device for 30 days
              </label> */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Don&apos;t have a provider account? </span>
            <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 ml-1">
              Request Provider Access
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}