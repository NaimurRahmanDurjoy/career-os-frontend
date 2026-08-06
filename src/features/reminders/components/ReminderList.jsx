import React, { useEffect, useState } from 'react';
import { useReminderStore } from '../store/useReminderStore';
import { Plus, CheckCircle2, Trash2, Calendar, Clock, Briefcase } from 'lucide-react';
import AddReminderModal from './AddReminderModal';

export default function ReminderList() {
    const { reminders, fetchReminders, markComplete, deleteReminder, loading } = useReminderStore();
    const [isAddOpen, setIsAddOpen] = useState(false);

    useEffect(() => {
        fetchReminders();
    }, [fetchReminders]);

    const activeReminders = reminders.filter(r => !r.is_completed).sort((a, b) => new Date(a.remind_at) - new Date(b.remind_at));
    const completedReminders = reminders.filter(r => r.is_completed).sort((a, b) => new Date(b.remind_at) - new Date(a.remind_at));

    const TypeBadge = ({ type }) => {
        const specs = {
            interview: { color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800/50', label: 'Interview' },
            follow_up: { color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50', label: 'Follow Up' },
            deadline: { color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50', label: 'Deadline' },
            custom: { color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50', label: 'Custom' }
        };
        const active = specs[type] || specs.custom;
        return (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${active.color}`}>
                {active.label}
            </span>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Mission Control</h1>
                    <p className="text-slate-500 font-medium mt-1">Organize your job search schedule and upcoming deadlines.</p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Reminder
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Column */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-2.5 rounded-lg">
                        <Clock size={16} className="text-blue-500" />
                        Upcoming Action Items
                        <span className="ml-auto bg-white dark:bg-slate-700 text-xs px-2 py-0.5 rounded-full text-slate-500 shadow-sm">{activeReminders.length}</span>
                    </h3>

                    {loading && activeReminders.length === 0 ? (
                        <div className="animate-pulse space-y-3">
                            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        </div>
                    ) : activeReminders.length === 0 ? (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-8 text-center text-slate-500">
                            <Calendar size={32} className="mx-auto mb-3 opacity-20" />
                            <p className="font-medium text-sm">Clear schedule! Enjoy your day.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeReminders.map(r => (
                                <div key={r.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm group hover:border-emerald-500/50 transition-colors relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <TypeBadge type={r.type} />
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => deleteReminder(r.id)} className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-900/30 rounded">
                                                <Trash2 size={14} />
                                            </button>
                                            <button onClick={() => markComplete(r.id)} className="p-1.5 text-slate-400 hover:text-emerald-500 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-900/30 rounded font-bold text-xs flex items-center gap-1">
                                                <CheckCircle2 size={14} /> Done
                                            </button>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{r.title}</h4>

                                    {r.description && <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug mb-3 line-clamp-2">{r.description}</p>}

                                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/50 text-[11px] font-bold text-slate-400">
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
                                            <Calendar size={12} className="text-emerald-500" />
                                            {new Date(r.remind_at).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {r.jobApplication && (
                                            <div className="flex items-center gap-1.5 text-indigo-500">
                                                <Briefcase size={12} />
                                                {r.jobApplication.company_name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed Column */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-2.5 rounded-lg opacity-70">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        Completed History
                    </h3>

                    <div className="space-y-2">
                        {completedReminders.slice(0, 10).map(r => (
                            <div key={r.id} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">{r.title}</h4>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{new Date(r.updated_at).toLocaleDateString()}</p>
                                </div>
                                <button onClick={() => deleteReminder(r.id)} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg shrink-0">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddReminderModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
        </div>
    );
}
