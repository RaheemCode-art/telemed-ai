'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

const publicRoutes = ['/', '/login', '/register'];

const roleRouteRestrictions: Record<string, string[]> = {
    '/admin': ['admin'],
    '/booking': ['patient'],
    '/reports': ['patient', 'doctor', 'admin'],
    '/onboarding': ['patient'],
    '/consultation': ['patient', 'doctor'],
};

export default function GlobalRouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verifyAccess = () => {
            if (publicRoutes.includes(pathname)) {
                setAuthorized(true);
                return;
            }

            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                router.replace('/login');
                return;
            }

            try {
                const user = JSON.parse(userStr);

                if (user.role === 'patient' && !user.completedOnboarding && pathname !== '/onboarding') {
                    router.replace('/onboarding');
                    return;
                }
                if (user.role === 'doctor' && user.tempPasswordStatus === true && pathname !== '/change-password') {
                    router.replace('/change-password');
                    return;
                }

                const matchedRoute = Object.keys(roleRouteRestrictions).find((route) =>
                    pathname.startsWith(route)
                );

                if (matchedRoute) {
                    const allowedRoles = roleRouteRestrictions[matchedRoute];
                    if (!allowedRoles.includes(user.role)) {
                        router.replace('/dashboard');
                        return;
                    }
                }

                setAuthorized(true);
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.replace('/login');
            }
        };

        setAuthorized(false);
        verifyAccess();
    }, [router, pathname]);

    if (!authorized && !publicRoutes.includes(pathname)) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse mb-4">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-600">Verifying system access permissions...</p>
            </div>
        );
    }

    return <>{children}</>;
}