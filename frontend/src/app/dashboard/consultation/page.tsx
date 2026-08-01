'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  User, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';
import { getSocket } from '@/lib/socket';

export default function ConsultationPortal() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports'>('overview');
  const [inputMessage, setInputMessage] = useState('');
  const [userRole, setUserRole] = useState<string>('patient');
  
  const [patientContext, setPatientContext] = useState({
    name: 'Eleanor Vance',
    age: 42,
    gender: 'Female',
    weight: 68,
    height: 165,
    allergies: ['Penicillin', 'Peanuts'],
    currentMedications: ['Metformin 1000mg', 'Lisinopril 10mg'],
    preExistingConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    emergencyContact: '+92 300 1234567',
  });

  const [reports, setReports] = useState<any[]>([
    {
      _id: 'rep-1',
      fileName: 'HbA1c_Lab_Report_Oct2023.pdf',
      fileUrl: '/uploads/sample.pdf',
      uploadStatus: 'Completed',
      aiSummary: 'Patient exhibits consistent morning hyperglycemia (fasting blood glucose averaging ~130 mg/dL). Recommended shift in Metformin timing to evening meal.',
      createdAt: '2023-10-24',
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Dr. John Smith',
      role: 'doctor',
      text: 'Hello Eleanor, I have reviewed your onboarding profile and your recent AI laboratory summary. How have you been feeling since we adjusted your dosage?',
      time: '10:02 AM',
    },
    {
      id: '2',
      sender: 'Eleanor Vance',
      role: 'patient',
      text: "Hi Dr. Smith. Honestly, I've been feeling a bit nauseous in the mornings, and my fasting numbers are still hovering around 130.",
      time: '10:03 AM',
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          setUserRole(u.role || 'patient');
          if (u.role === 'patient') {
            setPatientContext({
              name: `${u.firstName || 'Raheem'} ${u.lastName || 'Kandhro'}`,
              age: u.age || 22,
              gender: u.gender || 'male',
              weight: u.weight || 68,
              height: u.height || 165,
              allergies: u.allergies?.length ? u.allergies : ['Penicillin (Default)'],
              currentMedications: u.currentMedications?.length ? u.currentMedications : ['Metformin 1000mg'],
              preExistingConditions: u.preExistingConditions?.length ? u.preExistingConditions : ['Type 2 Diabetes'],
              emergencyContact: u.emergencyContact || '+92 300 1234567',
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    const fetchContextData = async () => {
      try {
        const res = await api.get('/reports');
        if (res.data && res.data.length > 0) {
          setReports(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContextData();

    const socket = getSocket();
    socket.connect();
    socket.emit('join-room', 'mvp-appointment-room-101');

    socket.on('receive-message', (newMessage: any) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const u = userStr ? JSON.parse(userStr) : { firstName: 'User', lastName: '', role: 'patient' };

    const newMessage = {
      id: Date.now().toString(),
      sender: `${u.firstName} ${u.lastName}`,
      role: u.role,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    const socket = getSocket();
    socket.emit('send-message', { room: 'mvp-appointment-room-101', message: newMessage });
    setInputMessage('');
  };

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <span>TeleMed Portal</span>
            <span>Real-time Text Consultation</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {userRole === 'doctor' ? `Consulting: ${patientContext.name}` : 'Active Session with Dr. John Smith'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
         
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            End Consultation
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px]">
        <aside aria-label="Patient Medical Context" className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Onboarding Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'reports' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>AI Report Summaries ({reports.length})</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Baseline Demographics</span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    <div><span className="text-slate-400">Age:</span> {patientContext.age} Years</div>
                    <div><span className="text-slate-400">Gender:</span> {patientContext.gender}</div>
                    <div><span className="text-slate-400">Weight:</span> {patientContext.weight} kg</div>
                    <div><span className="text-slate-400">Height:</span> {patientContext.height} cm</div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Known Allergies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {patientContext.allergies.map((item, idx) => (
                      <div key={idx} className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-red-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pre-existing Conditions</span>
                  <ul className="space-y-1.5 text-xs font-semibold text-slate-700">
                    {patientContext.preExistingConditions.map((cond, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Current Medications</span>
                  <div className="space-y-2">
                    {patientContext.currentMedications.map((med, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
                        {med}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Emergency Contact</span>
                  <div className="text-xs font-bold text-slate-900">{patientContext.emergencyContact}</div>
                </div>
              </>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs font-medium">
                    No medical PDF reports uploaded for this patient.
                  </div>
                ) : (
                  reports.map((rep) => (
                    <article key={rep._id} className="p-4 rounded-2xl border border-blue-100 bg-blue-50/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-blue-100/80 pb-2">
                        <div className="font-bold text-xs text-slate-900 truncate max-w-[180px]">{rep.fileName}</div>
                        <a
                          href={`http://localhost:5000${rep.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span>PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 mb-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Simplified Clinical Summary</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {rep.aiSummary || 'Summary processing in progress...'}
                        </p>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>
        </aside>

        <main aria-label="Real-time Chat Workspace" className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
          <header className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="font-bold text-sm text-slate-900">Live Consultation Stream (Text-Only MVP)</span>
            </div>
            <span className="text-xs font-semibold text-slate-400">Appointment ID: #MVP-101</span>
          </header>

          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
            {messages.map((msg) => {
              const isMe = (userRole === 'doctor' && msg.role === 'doctor') || (userRole === 'patient' && msg.role === 'patient');
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mb-1">
                    <span>{msg.sender}</span>
                    <span>•</span>
                    <span>{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      isMe 
                        ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here... (Press Enter to send)"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white p-3 rounded-xl transition-all shadow-md shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </main>
      </div>
    </DashboardLayout>
  );
}