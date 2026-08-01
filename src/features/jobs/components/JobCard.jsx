import React from 'react';
import { useJobsStore } from '../store/useJobsStore';
import { Briefcase, Calendar, Banknote, Trash2 } from 'lucide-react';

export default function JobCard({ job }) {
    const { deleteJob, updateJobStatus } = useJobsStore();

    const statuses = ['applied', 'shortlisted', 'interview', 'offer', 'rejected'];

    const handleDragStart = (e) => {
        e.dataTransfer.setData('jobId', job.id);
        e.target.style.opacity = '0.4';
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="group relative bg-white dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-md shadow-slate-200/50 dark:shadow-black/20 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all cursor-grab active:cursor-grabbing mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
            {/* Ambient hover glow inside card */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>

            <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 flex-1 tracking-wide">
                    {job.company_name}
                </h3>
                <button
                    onClick={() => deleteJob(job.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity p-1 -mt-1 -mr-1"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-3 relative z-10">
                <Briefcase size={14} className="mr-2 opacity-70" />
                <span className="line-clamp-1">{job.role}</span>
            </div>

            <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md shadow-inner">
                    <Banknote size={12} className="mr-1" />
                    {job.salary_range || 'Unknown Salary'}
                </div>

                <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar size={12} className="mr-1 text-slate-400 dark:text-slate-500" />
                    {new Date(job.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            </div>

            {/* Mobile quick status change fallback if Drag and Drop is hard */}
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 lg:hidden relative z-10">
                <select
                    className="w-full text-xs font-bold bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-md text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer p-1.5"
                    value={job.status}
                    onChange={(e) => updateJobStatus(job.id, e.target.value)}
                >
                    {statuses.map(s => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-300">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
