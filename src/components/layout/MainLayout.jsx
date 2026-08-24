import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

import { Sun, Moon, User, Menu } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import ReminderBell from '../../features/reminders/components/ReminderBell';
import FloatingChatbot from '../../features/chat/components/FloatingChatbot';

export default function MainLayout({ children, activeView, setActiveView }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { isDarkMode, toggleTheme } = useThemeStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const viewTitles = {
        dashboard: 'Dashboard',
        resume: 'Resume Analyzer',
        jobs: 'Application CRM Dashboard',
        'match-checker': 'Job Match Checker',
        preparation: 'Prep Tracker',
        'mock-tests': 'AI Mock Tests',
        reminders: 'Reminders',
        billing: 'Upgrade Plan',
        profile: 'User Profile',
        'cv-builder': 'ATS CV Builder'
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                user={user}
                logout={logout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
            />
            {/* Main Content Area */}
            <main className={`flex-1 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} min-w-0 min-h-screen flex flex-col relative transition-all duration-300 ease-in-out`}>
                <header className="h-20 sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-colors duration-300">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Mobile Menu"
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:block p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Toggle Desktop Menu"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white shrink-0">
                            {viewTitles[activeView] || 'Career OS'}
                        </h2>
                        {user?.current_plan && (
                            <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {user.current_plan.name}
                                </span>
                                {user.current_plan.days_remaining !== null && (
                                    <span className="text-[10px] font-semibold bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full ml-1">
                                        {user.current_plan.days_remaining}d left
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <ReminderBell />

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button
                            onClick={() => setActiveView('profile')}
                            className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
                        >
                            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[120px]">{user?.name || 'Account'}</p>
                            </div>
                        </button>
                    </div>
                </header>
                <div className="p-8 flex-1">
                    {children}
                </div>
            </main>

            <FloatingChatbot />
        </div>
    );
}
