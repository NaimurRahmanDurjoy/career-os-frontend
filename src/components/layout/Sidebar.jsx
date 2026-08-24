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
    BrainCircuit,
    CreditCard,
    X,
    Sparkles
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, user, logout, isOpen, setIsOpen, isCollapsed }) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'resume', label: 'Resume Analyzer', icon: FileText },
        { id: 'jobs', label: 'Job Tracker', icon: Kanban },
        { id: 'match-checker', label: 'Job Match Checker', icon: Target },
        { id: 'cv-builder', label: 'ATS CV Builder', icon: Sparkles },
        { id: 'preparation', label: 'Prep Tracker', icon: BookOpen },
        { id: 'mock-tests', label: 'AI Mock Tests', icon: BrainCircuit },
        { id: 'reminders', label: 'Reminders', icon: Bell },
        { id: 'billing', label: 'Billing & Plans', icon: CreditCard }
    ];

    return (
        <aside className={`${isCollapsed ? 'w-20' : 'w-64'} fixed left-0 top-0 bottom-0 flex flex-col z-50 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:translate-x-0 lg:shadow-none`}>
            {/* Logo Area */}
            <div className={`h-20 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-200 dark:border-slate-800`}>
                <div className="flex items-center">
                    <div className={`bg-emerald-500 p-2 rounded-xl text-white ${isCollapsed ? '' : 'mr-3'}`}>
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <span className="font-black text-lg tracking-wide text-slate-900 dark:text-white line-clamp-1">
                                Career OS
                            </span>
                            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Pro Edition</p>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <button
                        onClick={() => setIsOpen && setIsOpen(false)}
                        className="lg:hidden p-2 -mr-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Navigation Menus */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            title={isCollapsed ? item.label : undefined}
                            onClick={() => {
                                setActiveView(item.id);
                                if (setIsOpen) setIsOpen(false);
                            }}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg transition-colors duration-200 font-semibold text-sm ${isActive
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <Icon size={isCollapsed ? 22 : 18} className={`${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70'} ${isCollapsed ? 'shrink-0' : ''}`} />
                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </button>
                    )
                })}
            </nav>

            {/* User Account / Footer */}
            <div className={`p-3 ${isCollapsed ? 'mx-2 flex justify-center' : 'mx-4'} mb-4 mt-auto rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 relative group overflow-hidden transition-colors hover:border-slate-300 dark:hover:border-slate-700`}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-inner" title={isCollapsed ? (user?.name || 'Account') : undefined}>
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    {!isCollapsed && (
                        <>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">{user?.name || 'Account'}</p>
                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                title="Sign Out"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors shrink-0"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
