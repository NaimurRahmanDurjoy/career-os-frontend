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

export default function KanbanBoard() {
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
        <div className="flex w-full gap-4 overflow-x-auto pb-4 snap-x">
            {COLUMNS.map((col) => {
                const columnJobs = jobs.filter(job => job.status === col.id);
                return (
                    <div
                        key={col.id}
                        className="flex-none w-80 lg:flex-1 shrink-0 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/60 flex flex-col min-h-[600px] snap-center"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`font-semibold text-sm px-3 py-1 rounded-full border ${col.color}`}>
                                {col.label}
                            </h2>
                            <span className="text-gray-400 dark:text-gray-500 font-medium text-sm flex items-center justify-center bg-white dark:bg-gray-900 shadow-sm w-7 h-7 rounded-full">
                                {columnJobs.length}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pretty-scrollbar">
                            {columnJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                            {columnJobs.length === 0 && (
                                <div className="h-full w-full flex flex-col items-center justify-center opacity-50 py-10">
                                    <Layers className="text-gray-300 dark:text-gray-600 mb-2" size={24} />
                                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Drop jobs here</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
