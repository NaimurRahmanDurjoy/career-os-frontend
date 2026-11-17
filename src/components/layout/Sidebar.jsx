import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FileText,
    Kanban,
    Briefcase,
    LayoutDashboard,
    Bell,
    Target,
    BookOpen,
    BrainCircuit,
    CreditCard,
    X,
    Sparkles,
    MessageSquare,
    Compass
} from 'lucide-react';
import SidebarSetupItem from './SidebarSetupItem';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed }) {
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/circulars', label: 'Job Circulars', icon: Compass },
        { path: '/resumes', label: 'Resume Analyzer', icon: FileText },
        { path: '/jobs', label: 'Job Tracker', icon: Kanban },
        { path: '/match-checker', label: 'Job Match Checker', icon: Target },
        { path: '/cv-builder', label: 'ATS CV Builder', icon: Sparkles },
        { path: '/preparation', label: 'Prep Tracker', icon: BookOpen },
        { path: '/mock-tests', label: 'AI Mock Tests', icon: BrainCircuit },
        { path: '/reminders', label: 'Reminders', icon: Bell },
        { path: '/billing', label: 'Billing & Plans', icon: CreditCard },
        { path: '/support', label: 'Help & Support', icon: MessageSquare }
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
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={isCollapsed ? item.label : undefined}
                            onClick={() => {
                                if (setIsOpen) setIsOpen(false);
                            }}
                            className={({ isActive }) => `w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 rounded-xl transition-colors duration-200 font-semibold text-sm ${isActive
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={isCollapsed ? 22 : 18} className={`${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70'} ${isCollapsed ? 'shrink-0' : ''}`} />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Sleek Setup Guide Item (Triggers Clean Centered Modal) */}
            <div className="pb-3">
                <SidebarSetupItem isCollapsed={isCollapsed} />
            </div>
        </aside>
    );
}
