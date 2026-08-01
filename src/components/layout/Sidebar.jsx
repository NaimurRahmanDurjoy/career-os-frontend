import React from 'react';
import { FileText, Kanban, LogOut, Briefcase } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, user, logout }) {
    const navItems = [
        { id: 'resume', label: 'Resume Analyzer', icon: FileText },
        { id: 'jobs', label: 'Job Tracker', icon: Kanban }
    ];

    return (
        <aside className="w-64 fixed left-4 top-4 bottom-4 flex flex-col z-50">
            <div className="flex-1 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col shadow-xl dark:shadow-2xl overflow-hidden shadow-emerald-900/5 dark:shadow-black/20">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="bg-gradient-to-tr from-emerald-500 to-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20 mr-4 border border-emerald-400/30">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="font-extrabold text-sm tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                            Career OS
                        </span>
                        <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold tracking-widest uppercase">Pro Edition</p>
                    </div>
                </div>

                {/* Navigation Menus */}
                <nav className="flex-1 px-4 py-8 space-y-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm group ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 shadow-[0_4px_15px_rgba(16,185,129,0.05)] dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 text-slate-500 dark:text-slate-400 border border-transparent'
                                    }`}
                            >
                                <Icon size={20} className={`transition-colors duration-300 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'opacity-70 group-hover:text-emerald-500 dark:group-hover:text-emerald-300'}`} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                {/* User Account / Footer */}
                <div className="p-5 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/80 dark:bg-slate-800/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900/50 hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-500/40 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-wider group shadow-sm dark:shadow-none"
                    >
                        <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
