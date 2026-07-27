'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  History,
  Video,
  Settings,
  LogOut,
  Stethoscope,
  ShieldAlert,
  UserPlus
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
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

  const displayRole = currentUser?.role === 'admin'
    ? 'System Administrator'
    : currentUser?.role === 'doctor'
      ? (currentUser.specialty || 'Medical Specialist')
      : 'Patient Portal';

  const initials = currentUser ? `${currentUser.firstName[0] || ''}${currentUser.lastName[0] || ''}`.toUpperCase() : 'UP';

  const allNavItems: NavItem[] = [
    { name: 'Admin Portal', href: '/admin', icon: ShieldAlert, roles: ['admin'] },
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['patient', 'doctor'] },
    { name: 'Book Appointment', href: '/booking', icon: Stethoscope, roles: ['patient'] },
    { name: 'My Reports', href: '/dashboard/reports', icon: FileText, roles: ['patient', 'doctor'] },
    { name: 'My Patients', href: '/dashboard/patients', icon: Users, roles: ['doctor'] },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar, roles: ['doctor'] },
    { name: 'E-Prescriptions', href: '/dashboard/prescriptions', icon: FileText, roles: ['doctor'] },
    { name: 'Medical Records', href: '/dashboard/records', icon: History, roles: ['patient', 'doctor'] },
  ];

  const filteredNavItems = allNavItems.filter(item =>
    !currentUser || item.roles.includes(currentUser.role)
  );

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-5 sticky top-0 h-screen shrink-0">
      <div>
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border shrink-0 ${currentUser?.role === 'admin' ? 'bg-purple-100 text-purple-600 border-purple-200' : 'bg-blue-100 text-blue-600 border-blue-200'
            }`}>
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 leading-tight truncate">{displayName}</h3>
            <p className="text-xs text-slate-500 font-medium capitalize truncate">{displayRole}</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/admin' && pathname.startsWith('/admin'));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-slate-100 text-blue-600 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-100">
        {currentUser?.role === 'admin' ? (
          <Link
            href="/admin"
            className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage Doctors</span>
          </Link>
        ) : (
          <Link
            href={currentUser?.role === 'doctor' ? '/dashboard/consultation' : '/booking'}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
          >
            {currentUser?.role === 'doctor' ? <Video className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
            <span>{currentUser?.role === 'doctor' ? 'Start Consultation' : 'Book Consultation'}</span>
          </Link>
        )}

        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}