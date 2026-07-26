'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Smile, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardOverview() {
  const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string; role: string; specialty?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User Profile';
  const displayRole = currentUser?.role === 'doctor' ? (currentUser.specialty || 'Medical Specialist') : 'Patient Portal';

  const stats = [
    {
      label: 'Total Consultations',
      value: '12',
      subtext: 'Scheduled Today',
      icon: Activity,
      iconColor: 'text-blue-600',
    },
    {
      label: 'Patient Satisfaction',
      value: '4.9',
      subtext: '/ 5.0 Average',
      icon: Smile,
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Next Appointment',
      value: '10:30 AM',
      subtext: 'Sarah Jenkins • Follow-up',
      icon: Clock,
      iconColor: 'text-indigo-600',
    },
  ];

  const todayAppointments = [
    {
      id: '1',
      initials: 'SJ',
      name: 'Sarah Jenkins',
      type: 'Cardiovascular Checkup',
      time: '10:30 AM',
      duration: '30 Min',
      status: 'CONFIRMED',
      statusColor: 'bg-green-100 text-green-700',
      avatarBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: '2',
      initials: 'MC',
      name: 'Michael Chang',
      type: 'Lab Results Review',
      time: '11:15 AM',
      duration: '15 Min',
      status: 'IN WAITING ROOM',
      statusColor: 'bg-indigo-100 text-indigo-700',
      avatarBg: 'bg-amber-100 text-amber-700',
    },
    {
      id: '3',
      initials: 'ER',
      name: 'Elena Rodriguez',
      type: 'Initial Consultation',
      time: '1:00 PM',
      duration: '45 Min',
      status: 'PENDING',
      statusColor: 'bg-yellow-100 text-yellow-800',
      avatarBg: 'bg-slate-200 text-slate-700',
    },
  ];

  const patientRequests = [
    {
      id: 'req-1',
      type: 'REFILL REQUEST',
      time: '2h ago',
      title: 'Lisinopril 10mg',
      patient: 'Requested by Robert Davis',
      actionText: 'Review',
      isUrgent: false,
    },
    {
      id: 'req-2',
      type: 'MESSAGE',
      time: 'Urgent',
      title: 'Post-op swelling inquiry',
      patient: 'From Alicia Keys',
      actionText: 'Reply',
      isUrgent: true,
    },
  ];

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good Morning, {displayName}
          </h1>
          <p className="text-sm text-slate-500 mt-1 capitalize">
            {displayRole} • Here is your clinical overview for today.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-medium text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <time dateTime="2026-07-26">Sunday, July 26, 2026</time>
        </div>
      </header>

      <section aria-label="Quick Statistics" className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <article key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-600">{stat.label}</span>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <span className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</span>
                <p className="text-xs text-slate-500 font-medium mt-1">{stat.subtext}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section aria-label="Appointments and Requests" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <header className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Today&apos;s Appointments</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
          </header>

          <div className="divide-y divide-slate-100">
            {todayAppointments.map((appt) => (
              <article key={appt.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${appt.avatarBg}`}>
                    {appt.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{appt.name}</h3>
                    <p className="text-xs text-slate-500 truncate">{appt.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">{appt.time}</div>
                    <div className="text-xs text-slate-400">{appt.duration}</div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${appt.statusColor}`}>
                    {appt.status}
                  </span>

                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <header className="pb-5 mb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Patient Requests</h2>
          </header>

          <div className="space-y-4">
            {patientRequests.map((req) => (
              <article key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    {req.isUrgent ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                    {req.type}
                  </span>
                  <span className={req.isUrgent ? 'text-red-600 font-bold' : 'text-slate-400'}>{req.time}</span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{req.patient}</p>
                </div>

                <button className={`w-full py-2 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  req.isUrgent 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}>
                  {req.actionText}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}