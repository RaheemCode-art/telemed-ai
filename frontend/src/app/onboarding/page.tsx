'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import api from '@/lib/axios';

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    weight: '',
    height: '',
    allergies: '',
    currentMedications: '',
    preExistingConditions: '',
    emergencyContact: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.completedOnboarding) {
            router.push('/dashboard');
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        router.push('/login');
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        age: Number(formData.age),
        gender: formData.gender,
        weight: Number(formData.weight),
        height: Number(formData.height),
        allergies: formData.allergies ? formData.allergies.split(',').map((item) => item.trim()).filter(Boolean) : [],
        currentMedications: formData.currentMedications ? formData.currentMedications.split(',').map((item) => item.trim()).filter(Boolean) : [],
        preExistingConditions: formData.preExistingConditions ? formData.preExistingConditions.split(',').map((item) => item.trim()).filter(Boolean) : [],
        emergencyContact: formData.emergencyContact,
        completedOnboarding: true,
      };

      const response = await api.put('/auth/profile', payload);

      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete onboarding. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans text-slate-800">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 my-8">
        <header className="mb-6 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 mb-3">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Mandatory Clinical Onboarding</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Medical Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            To ensure patient safety and accurate AI diagnostics, you must provide your baseline medical history before accessing telemedicine features.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Age (Years)</label>
              <input
                type="number"
                name="age"
                required
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                required
                min="1"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 70.5"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Height (cm)</label>
              <input
                type="number"
                name="height"
                required
                min="30"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 175"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Known Allergies <span className="text-slate-400 font-normal">(Optional, comma-separated)</span>
            </label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g. None or Peanuts"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Current Medications <span className="text-slate-400 font-normal">(Optional, comma-separated)</span>
            </label>
            <input
              type="text"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
              placeholder="e.g. None"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pre-existing Conditions <span className="text-slate-400 font-normal">(Optional, comma-separated)</span>
            </label>
            <input
              type="text"
              name="preExistingConditions"
              value={formData.preExistingConditions}
              onChange={handleChange}
              placeholder="e.g. None"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Emergency Contact Number
            </label>
            <input
              type="tel"
              name="emergencyContact"
              required
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="+92 300 1234567"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-4 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-6"
          >
            <span>{loading ? 'Saving Clinical Profile...' : 'Save & Continue to Portal'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}