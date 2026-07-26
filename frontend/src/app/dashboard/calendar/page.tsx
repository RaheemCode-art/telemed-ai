'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Video, User, Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState('2026-07-26');

  const scheduleItems = [
    {
      id: '1',
      time: '09:00 AM - 09:30 AM',
      patient: 'Michael Chang',
      type: 'Routine Checkup',
      mode: 'Video Consult',
      status: 'Completed',
      statusColor: 'bg-slate-100 text-slate-700',
      border: 'border-l-4 border-slate-400',
    },
    {
      id: '2',
      time: '10:30 AM - 11:00 AM',
      patient: 'Sarah Jenkins',
      type: 'Cardiovascular Follow-up',
      mode: 'Video Consult',
      status: 'In Progress',
      statusColor: 'bg-emerald-100 text-emerald-800',
      border: 'border-l-4 border-emerald-500',
    },
    {
      id: '3',
      time: '01:00 PM - 01:45 PM',
      patient: 'Elena Rodriguez',
      type: 'Initial Consultation',
      mode: 'Video Consult',
      status: 'Upcoming',
      statusColor: 'bg-blue-100 text-blue-800',
      border: 'border-l-4 border-blue-600',
    },
    {
      id: '4',
      time: '03:30 PM - 04:00 PM',
      patient: 'Arthur Pendelton',
      type: 'Lab Results Review',
      mode: 'Secure Chat',
      status: 'Upcoming',
      statusColor: 'bg-indigo-100 text-indigo-800',
      border: 'border-l-4 border-indigo-500',
    },
  ];

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Clinical Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your daily appointments and availability slots.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm">Day</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">Week</button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">Month</button>
          </div>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm text-sm transition-all">
            <Plus className="w-4 h-4" />
            <span>New Slot</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <header className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">July 2026</h2>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg hover:bg-slate-100 text-slate-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </header>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-xs font-bold text-slate-400 py-1">{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            <span className="p-2 text-xs text-slate-300">29</span>
            <span className="p-2 text-xs text-slate-300">30</span>
            {calendarDays.map((day) => {
              const isToday = day === 26;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(`2026-07-${day < 10 ? '0' + day : day}`)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center aspect-square ${
                    isToday
                      ? 'bg-blue-600 text-white shadow-md font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{day}</span>
                  {(day === 26 || day === 28 || day === 30) && (
                    <span className={`w-1 h-1 rounded-full mt-1 ${isToday ? 'bg-white' : 'bg-blue-600'}`}></span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <header className="pb-5 mb-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Schedule for Sunday, July 26</h2>
              <p className="text-xs text-slate-400 mt-0.5">4 clinical sessions booked</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              On Duty
            </span>
          </header>

          <div className="space-y-4">
            {scheduleItems.map((item) => (
              <article
                key={item.id}
                className={`p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-sm ${item.border}`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.patient}</h3>
                  <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {item.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <Video className="w-3 h-3" />
                      {item.mode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <button className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-sm transition-all">
                    Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}