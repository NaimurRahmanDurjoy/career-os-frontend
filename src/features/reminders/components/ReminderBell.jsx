import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useReminderStore } from '../store/useReminderStore';

export default function ReminderBell() {
    const { upcomingReminders, fetchUpcoming, markComplete } = useReminderStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUpcoming();
        // optionally poll every minute, but initial load is fine for now
    }, [fetchUpcoming]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const count = upcomingReminders.length;

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                title="Reminders"
            >
                <Bell size={20} />
                {count > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 rounded-t-xl">
                        <h3 className="font-bold text-sm tracking-wide text-slate-800 dark:text-slate-200 uppercase">Upcoming Reminders</h3>
                        {count > 0 && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">{count}</span>}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {count === 0 ? (
                            <div className="p-6 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                                <CheckCircle2 size={32} className="text-emerald-500/50 mb-2" />
                                <p className="text-sm font-medium">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {upcomingReminders.map(reminder => (
                                    <div key={reminder.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="flex gap-3 items-start">
                                            <div className="mt-0.5 p-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-500 rounded flex-shrink-0">
                                                <Clock size={14} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                                    {reminder.title}
                                                </h4>
                                                {reminder.job_application && (
                                                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 line-clamp-1 mt-0.5">
                                                        {reminder.job_application.role} @ {reminder.job_application.company_name}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mt-1.5">
                                                    <Calendar size={10} />
                                                    {formatTime(reminder.remind_at)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => markComplete(reminder.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 rounded transition-all"
                                                title="Mark Complete"
                                            >
                                                <CheckCircle2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
