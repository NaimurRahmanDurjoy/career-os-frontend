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
            className="group relative bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">
                    {job.company_name}
                </h3>
                <button
                    onClick={() => deleteJob(job.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1 -mt-1 -mr-1"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Briefcase size={14} className="mr-2 opacity-70" />
                <span className="line-clamp-1">{job.role}</span>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                    <Banknote size={12} className="mr-1" />
                    {job.salary_range || 'Unknown Salary'}
                </div>

                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    {new Date(job.application_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            </div>

            {/* Mobile quick status change fallback if Drag and Drop is hard */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 lg:hidden">
                <select
                    className="w-full text-xs bg-gray-50 dark:bg-gray-900 border-none rounded-md text-gray-600 dark:text-gray-400 focus:ring-0 cursor-pointer p-1"
                    value={job.status}
                    onChange={(e) => updateJobStatus(job.id, e.target.value)}
                >
                    {statuses.map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
