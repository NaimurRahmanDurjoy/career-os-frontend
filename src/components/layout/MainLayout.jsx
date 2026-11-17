import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { Sun, Moon, User, Menu, ChevronDown, LogOut, CreditCard, Shield, ExternalLink, HelpCircle } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import ReminderBell from '../../features/reminders/components/ReminderBell';
import FloatingChatbot from '../../features/chat/components/FloatingChatbot';

export default function MainLayout({ children }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { isDarkMode, toggleTheme } = useThemeStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const viewTitles = {
        '/dashboard': 'Dashboard',
        '/circulars': 'Job Circulars & Opportunities',
        '/resumes': 'Resume Analyzer',
        '/jobs': 'Application CRM Dashboard',
        '/match-checker': 'Job Match Checker',
        '/preparation': 'Prep Tracker',
        '/mock-tests': 'AI Mock Tests',
        '/reminders': 'Reminders',
        '/billing': 'Upgrade Plan',
        '/profile': 'User Profile',
        '/cv-builder': 'ATS CV Builder',
        '/support': 'Help & Support'
    };

    const currentTitle = viewTitles[location.pathname] || 'Career OS';

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
                            {currentTitle}
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

                    <div className="flex items-center gap-3">
                        <ReminderBell />

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Top-Right Profile Pill & Dropdown */}
                        <div className="relative" ref={profileDropdownRef}>
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className={`flex items-center gap-2.5 p-1 pr-3 rounded-full border transition-all ${isProfileDropdownOpen
                                        ? 'bg-slate-200/80 dark:bg-slate-800 border-emerald-500/50 shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                aria-expanded={isProfileDropdownOpen}
                            >
                                {user?.settings?.avatar ? (
                                    <img
                                        src={user.settings.avatar}
                                        alt={user?.name || 'Account'}
                                        className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/30"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : <User size={15} />}
                                    </div>
                                )}
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[110px] leading-tight">
                                        {user?.name || 'Account'}
                                    </p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-68 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                                    {/* User Info Header with Avatar */}
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                                        {user?.settings?.avatar ? (
                                            <img
                                                src={user.settings.avatar}
                                                alt={user?.name || 'Account'}
                                                className="h-10 w-10 rounded-full object-cover shrink-0 ring-2 ring-emerald-500/20"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                                                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Account'}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <div className="p-1.5 space-y-0.5">
                                        <button
                                            onClick={() => { setIsProfileDropdownOpen(false); navigate('/profile'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                                        >
                                            <User size={15} className="text-slate-400" />
                                            <span>Your Profile</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsProfileDropdownOpen(false); navigate('/billing'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                                        >
                                            <CreditCard size={15} className="text-slate-400" />
                                            <span>Billing & Subscription</span>
                                        </button>
                                        <button
                                            onClick={() => { setIsProfileDropdownOpen(false); navigate('/support'); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-xl transition-colors text-left"
                                        >
                                            <HelpCircle size={15} className="text-slate-400" />
                                            <span>Help & Support</span>
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800/80 my-1"></div>

                                    {/* Sign Out */}
                                    <div className="p-1.5">
                                        <button
                                            onClick={() => { setIsProfileDropdownOpen(false); logout(); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                                        >
                                            <LogOut size={15} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
