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
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                user={user}
                logout={logout}
            />
            {/* Main Content Area */}
            <main className="flex-1 ml-64 min-w-0 min-h-screen flex flex-col relative">
                <header className="h-20 sticky top-0 z-40 px-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {activeView === 'resume' ? 'Resume Analyzer' :
                                activeView === 'profile' ? 'User Profile' : 'Application CRM Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
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
        </div>
    );
}
