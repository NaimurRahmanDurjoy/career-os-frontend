import React from 'react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../features/auth/store/useAuthStore';

import { Sun, Moon, User } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';

export default function MainLayout({ children, activeView, setActiveView }) {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const { isDarkMode, toggleTheme } = useThemeStore();

    return (
        <div className="flex min-h-screen text-slate-900 dark:text-slate-100 selection:bg-emerald-500/30 relative transition-colors duration-300">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                user={user}
                logout={logout}
            />
            {/* Main Content Area */}
            <main className="flex-1 ml-[18rem] min-w-0 overflow-x-hidden min-h-screen flex flex-col relative z-10 transition-all duration-500">
                <header className="h-24 fixed top-0 right-0 left-[18rem] z-40 px-10 flex flex-col justify-end pb-5 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-transparent backdrop-blur-md transition-colors duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-8 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300 tracking-wide">
                                {activeView === 'resume' ? 'Resume Analyzer' :
                                    activeView === 'profile' ? 'User Profile' : 'Application CRM Dashboard'}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-all hover:shadow-md"
                                aria-label="Toggle Dark Mode"
                            >
                                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button
                                onClick={() => setActiveView('profile')}
                                className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all hover:border-emerald-300 dark:hover:border-emerald-500/50 group"
                            >
                                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[100px] leading-tight">{user?.name || 'Account'}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>
                <div className="px-8 pb-8 pt-2 mt-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
