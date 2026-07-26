'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    fullName: 'Dr. John Smith',
    specialty: 'Cardiology',
    bio: 'Board-certified cardiologist with over 15 years of experience in diagnosing and treating cardiovascular diseases. Passionate about preventive care and patient education.',
    isAvailable: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setFormData((prev) => ({
            ...prev,
            fullName: `${parsedUser.firstName || 'Dr. John'} ${parsedUser.lastName || 'Smith'}`,
            specialty: parsedUser.specialty || prev.specialty,
            bio: parsedUser.bio || prev.bio,
            isAvailable: parsedUser.isAvailable !== undefined ? parsedUser.isAvailable : prev.isAvailable,
          }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || 'MD';

      await api.put('/auth/profile', {
        firstName,
        lastName,
        specialty: formData.specialty,
        bio: formData.bio,
        isAvailable: formData.isAvailable,
      });

      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const updatedUser = { ...parsedUser, firstName, lastName, specialty: formData.specialty, bio: formData.bio, isAvailable: formData.isAvailable };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile changes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-4">
        <header className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Profile Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your professional information and availability.
          </p>
        </header>

        <main className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-10">
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile settings saved successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex flex-col items-center justify-center pb-6 border-b border-slate-100">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center font-bold text-2xl text-slate-700 shadow-inner overflow-hidden">
                  <span>{formData.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all border-2 border-white active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Dr. John Smith"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 tracking-wide">
                Specialty
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition-all"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="General Practice">General Practice</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Dermatology">Dermatology</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 tracking-wide">
                Professional Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter your clinical bio and experience..."
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 leading-relaxed transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4 pb-2 border-t border-b border-slate-100 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Available for Appointments</div>
                <div className="text-xs text-slate-500 mt-0.5">Allow patients to book new consultations.</div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-xs font-medium text-slate-600">
                  {formData.isAvailable ? 'Online' : 'Offline'}
                </span>
                <button
                  type="button"
                  onClick={handleToggle}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.isAvailable ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                      formData.isAvailable ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  >
                    {formData.isAvailable && <Check className="w-2.5 h-2.5 text-blue-600 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all text-sm disabled:opacity-70"
              >
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </DashboardLayout>
  );
}