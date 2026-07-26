'use client';
import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (

        <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-800">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto min-w-0">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>

    );
}