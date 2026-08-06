import React from 'react';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import {
    FileText,
    Kanban,
    LogOut,
    Briefcase,
    LayoutDashboard,
    Bell,
    Target,
    BookOpen,
    BrainCircuit
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, user, logout }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume', label: 'Resume Analyzer', icon: FileText },
        { id: 'jobs', label: 'Job Tracker', icon: Kanban },
        { id: 'match-checker', label: 'Job Match Checker', icon: Target },
        { id: 'preparation', label: 'Prep Tracker', icon: BookOpen },
        { id: 'mock-tests', label: 'AI Mock Tests', icon: BrainCircuit },
        { id: 'reminders', label: 'Reminders', icon: Bell }
    ];

    return (
        <aside className="w-64 fixed left-0 top-0 bottom-0 flex flex-col z-50 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <div className="bg-emerald-500 p-2 rounded-xl text-white mr-3">
                    <Briefcase className="h-5 w-5 text-white" />
                </div>
                <div>
                    <span className="font-black text-lg tracking-wide text-slate-900 dark:text-white">
                        Career OS
                    </span>
                    <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Pro Edition</p>
                </div>
            </div>

            {/* Navigation Menus */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 font-semibold text-sm ${isActive
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Icon size={18} className={`${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70'}`} />
                            <span>{item.label}</span>
                        </button>
                    )
                })}
            </nav>

            {/* User Account / Footer */}
            <div className="p-5 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Account'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500/30 rounded-lg transition-colors text-sm font-semibold"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
