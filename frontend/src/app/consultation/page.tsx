'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Activity, FileText, AlertCircle, Clock } from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import api from '@/lib/axios';

export default function ConsultationRoom() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');
  const router = useRouter();

  const [messages, setMessages] = useState<{ sender: string, text: string, timestamp: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatStatus, setChatStatus] = useState('Connecting to secure room...');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [patientContext, setPatientContext] = useState<any>({
    age: '-',
    gender: '-',
    allergies: [],
    medications: [],
    conditions: [],
    reports: []
  });
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!appointmentId) return;

    let loggedInUser = null;
    const userStr = localStorage.getItem('user');
    if (userStr) {
      loggedInUser = JSON.parse(userStr);
      setCurrentUser(loggedInUser);
    }

    const fetchContextData = async () => {
      try {
        setLoadingContext(true);

        // 1. Appointment data lana
        const res = await api.get('/appointments');
        const appointments = res.data || [];
        const appointmentData = appointments.find((app: any) => app._id === appointmentId);

        if (appointmentData && appointmentData.patientId) {
          const patient = appointmentData.patientId;
          const actualPatientId = patient._id || patient; // Handle both populated and plain ID

          // 2. Is specific patient ki reports fetch karna
          let patientReports = [];
          try {
            // Note: Agar aapka reports ka route /medicalreports hai toh yahan change kar lena
            const reportsRes = await api.get('/reports');
            patientReports = reportsRes.data.filter((r: any) =>
              r.patientId === actualPatientId || (r.patientId && r.patientId._id === actualPatientId)
            );
          } catch (err) {
            console.error("Reports load karne mein masla:", err);
          }

          // 3. Purani chat history load karna (agar refresh ho jaye)
          try {
            const chatRes = await api.get(`/messages/${appointmentId}`);
            if (chatRes.data && chatRes.data.length > 0) {
              const myRole = loggedInUser?.role === 'doctor' ? 'Doctor' : 'Patient';
              const history = chatRes.data.map((msg: any) => ({
                ...msg,
                sender: msg.sender === myRole ? 'Me' : msg.sender
              }));
              setMessages(history);
            }
          } catch (err) {
            console.log("No previous chat history found. Start a new chat.");
          }

          setPatientContext({
            age: patient.age || 'N/A',
            gender: patient.gender || 'N/A',
            allergies: patient.allergies || [],
            medications: patient.currentMedications || patient.current_medications || [],
            conditions: patient.preExistingConditions || patient.pre_existing_conditions || [],
            reports: patientReports // Ab yahan real reports aayengi!
          });
        }
      } catch (error) {
        console.error("Context fetch error:", error);
      } finally {
        setLoadingContext(false);
      }
    };

    fetchContextData();
  }, [appointmentId]);

  useEffect(() => {
    if (!appointmentId) return;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const socketUrl = backendUrl.replace('/api', '');

    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join_room', appointmentId);
      setChatStatus('Connected securely');
    });

    socketRef.current.on('receive_message', (data: { sender: string, text: string, timestamp: string }) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [appointmentId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socketRef.current) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const myRole = currentUser?.role === 'doctor' ? 'Doctor' : 'Patient';

      const messageData = {
        roomId: appointmentId,
        sender: myRole,
        text: inputMessage.trim(),
        timestamp
      };

      socketRef.current.emit('send_message', messageData);
      setMessages((prev) => [...prev, { ...messageData, sender: 'Me' }]);
      setInputMessage('');
    }
  };

return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Live Consultation</h1>
            <p className="text-xs font-medium text-slate-500">Session ID: {appointmentId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {chatStatus}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* LEFT PANEL: Ab yeh poora panel scrollable hai, summary shrink nahi hogi */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full overflow-y-auto relative flex flex-col gap-6">
          
          {loadingContext && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Patient Medical Context</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Demographics</p>
                <p className="text-sm font-semibold text-slate-900">{patientContext.age} yrs • {patientContext.gender}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-xs text-red-500 font-bold uppercase mb-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Allergies</p>
                <p className="text-sm font-semibold text-red-900">
                  {patientContext.allergies.length > 0 ? patientContext.allergies.join(', ') : 'None reported'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Current Medications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patientContext.medications.length > 0 ? (
                    patientContext.medications.map((med: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">{med}</span>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-slate-400">No active medications</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-orange-500" /> Pre-existing Conditions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patientContext.conditions.length > 0 ? (
                    patientContext.conditions.map((cond: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">{cond}</span>
                    ))
                  ) : (
                    <span className="text-xs font-medium text-slate-400">No pre-existing conditions</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">AI Summarized Reports</h2>
            <div className="space-y-3 pb-4">
              {patientContext.reports.length > 0 ? (
                patientContext.reports.map((report: any, i: number) => (
                  <div key={i} className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-slate-900">{report.fileName || report.name || 'Medical Report'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{report.aiSummary || 'Summary not available.'}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center">
                  <p className="text-xs font-medium text-slate-500">No medical reports uploaded by the patient.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Chat remains perfectly locked and independent */}
        <section className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col h-full overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-900 text-sm">Real-time Consultation</h3>
            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">Text Only</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm font-medium">No messages yet.</p>
                <p className="text-xs mt-1">Start the consultation by sending a message.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`max-w-[75%] p-3 flex flex-col gap-1 ${msg.sender === 'Me' ? 'self-end' : 'self-start'}`}>
                  <div className={`text-[10px] font-bold ${msg.sender === 'Me' ? 'text-right text-slate-400' : 'text-left text-slate-500'}`}>
                    {msg.sender === 'Me' ? 'You' : msg.sender} • {msg.timestamp}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'Me' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={sendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )}