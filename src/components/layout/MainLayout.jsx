import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

export default function MainLayout({ children, activeView, setActiveView }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                user={user}
                logout={logout}
            />
            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
                <header className="h-16 border-b border-slate-900/40 bg-slate-900/20 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center">
                    <h2 className="text-sm font-medium text-slate-400 opacity-60 uppercase tracking-widest">
                        {activeView === 'resume' ? 'AI Resume Analyzer' : 'Application CRM'}
                    </h2>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
