import React from 'react';
import JobCard from './JobCard';
import { useJobsStore } from '../store/useJobsStore';
import { Layers } from 'lucide-react';

const COLUMNS = [
    { id: 'applied', label: 'Applied', color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' },
    { id: 'shortlisted', label: 'Shortlisted', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
    { id: 'interview', label: 'Interview', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
    { id: 'offer', label: 'Offer', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
    { id: 'rejected', label: 'Rejected', color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' }
];

export default function KanbanBoard({ onOpenNotes, onOpenContacts }) {
    const { jobs, updateJobStatus } = useJobsStore();

    const handleDragOver = (e) => {
        e.preventDefault(); // allow drop
    };

    const handleDrop = (e, targetStatus) => {
        e.preventDefault();
        const jobId = e.dataTransfer.getData('jobId');
        if (jobId) {
            updateJobStatus(jobId, targetStatus);
        }
    };

    return (
        <div className="flex w-full gap-4 overflow-x-auto pb-4 snap-x h-full">
            {COLUMNS.map((col) => {
                const columnJobs = jobs.filter(job => job.status === col.id);
                return (
                    <div
                        key={col.id}
                        className="flex-none w-[320px] lg:flex-1 shrink-0 bg-slate-50 dark:bg-slate-800 backdrop-blur-md rounded-3xl p-5 border border-slate-200 dark:border-white/10 flex flex-col h-full snap-center shadow-lg shadow-emerald-900/5 dark:shadow-black/20"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex items-center justify-between mb-5 border-b border-slate-200 dark:border-white/10 pb-3">
                            <h2 className={`font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-inner ${col.color}`}>
                                {col.label}
                            </h2>
                            <span className="text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-inner w-7 h-7 rounded-full">
                                {columnJobs.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pretty-scrollbar pr-2 pb-2">
                            {columnJobs.map((job) => (
                                <JobCard key={job.id} job={job} onOpenNotes={onOpenNotes} onOpenContacts={onOpenContacts} />
                            ))}
                            {columnJobs.length === 0 && (
                                <div className="h-[200px] w-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/30 mt-2">
                                    <Layers className="text-emerald-500/40 mb-3" size={28} />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">No jobs in this stage</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
