import React, { useEffect, useState } from 'react';
import { useJobsStore } from './store/useJobsStore';
import KanbanBoard from './components/KanbanBoard';
import AddJobModal from './components/AddJobModal';

export default function JobsDashboard() {
    const { fetchJobs, loading } = useJobsStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto h-[calc(100vh-12rem)] flex flex-col relative z-10 overflow-hidden">
            {/* Header section with gradient title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight transition-colors duration-300">
                        Job Tracker
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors duration-300">
                        Track and manage your job applications across each stage.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 sm:mt-0 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] text-white font-bold rounded-xl transition-all outline-none border border-emerald-400 flex items-center justify-center gap-2 text-sm"
                >
                    <span className="font-black">+</span> Add Application
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center text-indigo-300">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3"></div>
                        <span className="font-bold uppercase tracking-widest text-xs">Synchronizing Timeline...</span>
                    </div>
                ) : (
                    <KanbanBoard />
                )}
            </div>

            <AddJobModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
}
