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
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto h-screen flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Job Tracker Pipeline
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track your job applications and move them across stages.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 shadow-md shadow-blue-500/20 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-blue-500/30"
                >
                    + Add Opportunity
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                        Loading timeline...
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
