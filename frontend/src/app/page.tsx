import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Activity, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  UserCheck, 
  Lock, 
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              T
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              TeleMed <span className="text-blue-600">AI</span>
            </span>
          </Link>

          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">Clinical Workflow</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">HIPAA Security</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-all border border-slate-200"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section aria-labelledby="hero-heading" className="relative overflow-hidden pt-20 pb-28 bg-gradient-to-b from-white via-blue-50/30 to-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Generation Academic Telemedicine MVP</span>
            </div>

            <h1 id="hero-heading" className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
              Advanced Digital Healthcare, Powered by <span className="text-blue-600">AI Report Synthesis.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Connect with verified clinical practitioners through secure real-time messaging, complete mandatory medical onboarding, and transform complex laboratory PDFs into patient-friendly summaries using Google Gemini AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-3 text-base"
              >
                <UserCheck className="w-5 h-5" />
                <span>Register as Patient</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-3 text-base"
              >
                <Lock className="w-5 h-5 text-slate-400" />
                <span>Provider Portal Access</span>
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/60 max-w-4xl mx-auto">
              <div>
                <div className="text-2xl font-black text-slate-900">100%</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Role-Based Access Control</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-600">Gemini 2.5</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">AI Clinical Translator</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">Real-Time</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Socket.io Consultation Chat</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">Verified</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">Admin Onboarding Network</div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" aria-labelledby="features-heading" className="py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 id="features-heading" className="text-3xl font-bold text-slate-900 tracking-tight">
                Architected for Clinical Accuracy & Speed
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Our platform bridges the gap between raw diagnostic diagnostics and seamless practitioner communication without compromising patient security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">AI PDF Summarization</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Patients can upload complex PDF medical laboratory reports. The system automatically extracts text and utilizes Google Gemini AI to generate simple, understandable explanations.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/60 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span>HIPAA Protected File Handling</span>
                </div>
              </article>

              <article className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Split-Screen Consultations</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Doctors review patient onboarding data, known allergies, pre-existing conditions, and AI report summaries on the left panel while conducting real-time synced text chat on the right.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/60 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span>Socket.io Instant Synchronization</span>
                </div>
              </article>

              <article className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Strict Role-Based Access</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dedicated environments for Patients, Doctors, and Administrators. Doctor credentials are strictly controlled and generated by system administrators with mandatory temporary password protocols.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/60 text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <span>256-Bit Encrypted Sessions</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="workflow" aria-labelledby="workflow-heading" className="py-24 bg-[#f8fafc]">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 id="workflow-heading" className="text-3xl font-bold text-slate-900 tracking-tight">
                Standardized Patient Onboarding Workflow
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                To guarantee clinical safety, patients must complete a structured onboarding sequence prior to booking telemedicine sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  STEP 01
                </span>
                <div className="pt-4 space-y-2">
                  <h3 className="font-bold text-slate-900">Mandatory Profile Setup</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Patients enter vital metrics including weight, height, existing medical conditions, active medications, and verified emergency contact details.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  STEP 02
                </span>
                <div className="pt-4 space-y-2">
                  <h3 className="font-bold text-slate-900">Laboratory Synthesis</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Upload medical PDF reports to our secure cloud. The AI engine translates dense medical jargon into digestible summaries for immediate review.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
                <span className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full">
                  STEP 03
                </span>
                <div className="pt-4 space-y-2">
                  <h3 className="font-bold text-slate-900">Live Clinical Consult</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Connect with an assigned physician via secure real-time messaging, with full medical history and report summaries accessible to the doctor instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="security" aria-label="System Notice" className="bg-slate-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-slate-800 text-blue-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                <HeartPulse className="w-4 h-4" />
                <span>Academic MVP Notice</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Need Administrative Network Access?</h2>
              <p className="text-sm text-slate-400 max-w-xl">
                System surveillance, practitioner account provisioning, and overview audits are restricted to authorized system administrators.
              </p>
            </div>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all shrink-0"
            >
              Admin & Provider Login
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              T
            </div>
            <span>TeleMed AI System • Student MVP Architecture</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} TeleMed AI. Developed for full-stack academic evaluation. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-blue-600">Privacy Protocol</Link>
            <Link href="/login" className="hover:text-blue-600">Terms of Care</Link>
            <Link href="/admin" className="hover:text-blue-600 font-bold text-slate-700">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}