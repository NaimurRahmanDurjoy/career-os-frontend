import React from 'react';
import { FileText, Kanban, LogOut, Briefcase } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, user, logout }) {
    const navItems = [
        { id: 'resume', label: 'Resume Parser', icon: FileText },
        { id: 'jobs', label: 'Job Tracker', icon: Kanban }
    ];

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 text-slate-300">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-1.5 rounded-lg text-white shadow-md mr-3">
                    <Briefcase className="h-4 w-4" />
                </div>
                <span className="font-black text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    Career OS
                </span>
            </div>

            {/* Navigation Menus */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                                ? 'bg-blue-600/10 text-blue-400 font-semibold'
                                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'text-blue-500' : 'opacity-70'} />
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            {/* User Account / Footer */}
            <div className="p-4 border-t border-slate-800 m-4 rounded-xl bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 rounded-lg transition-all text-xs font-medium uppercase tracking-wider"
                >
                    <LogOut size={14} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
