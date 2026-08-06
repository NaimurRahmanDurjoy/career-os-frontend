import React, { useState } from 'react';
import { X, Calendar, Clock, Briefcase, FileText } from 'lucide-react';
import { useReminderStore } from '../store/useReminderStore';

export default function AddReminderModal({ isOpen, onClose }) {
    const { addReminder } = useReminderStore();

    // Quick default: tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const [formData, setFormData] = useState({
        title: '',
        type: 'follow_up',
        description: '',
        remind_at: tomorrow.toISOString().slice(0, 16),
        job_application_id: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!isOpen) {
            setFormData(prev => ({ ...prev, title: '', description: '' }));
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await addReminder({
                ...formData,
                job_application_id: formData.job_application_id || null
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save reminder.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Calendar size={18} className="text-emerald-500" />
                        Create Reminder
                    </h2>
                    <button onClick={onClose} className="p-2 bg-slate-200/50 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-semibold rounded-xl border border-rose-100 dark:border-rose-900/50">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Reminder Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
                            placeholder="e.g. Follow up on Technical Round"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all appearance-none cursor-pointer dark:text-white font-medium"
                            >
                                <option value="follow_up">🎯 Follow Up</option>
                                <option value="interview">🗣️ Interview</option>
                                <option value="deadline">⏰ Deadline</option>
                                <option value="custom">📌 Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                                Time
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.remind_at}
                                onChange={e => setFormData({ ...formData, remind_at: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all dark:text-white text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                            <FileText size={12} /> Notes (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all dark:text-white h-24 resize-none"
                            placeholder="Add any context or links you need..."
                        />
                    </div>

                    <div className="pt-2 relative z-10 w-full">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Calendar size={18} />
                            {submitting ? 'Scheduling...' : 'Schedule Reminder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
