import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useJobsStore = create((set, get) => ({
    jobs: [],
    loading: false,
    error: null,

    fetchJobs: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/jobs');
            set({ jobs: response.data, loading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch jobs', loading: false });
        }
    },

    addJob: async (jobData) => {
        try {
            const response = await apiClient.post('/jobs', jobData);
            set((state) => ({ jobs: [response.data, ...state.jobs] }));
        } catch (error) {
            console.error('Failed to add job:', error);
            throw error;
        }
    },

    updateJobStatus: async (id, status) => {
        // Optimistic UI update
        const originalJobs = get().jobs;
        set((state) => ({
            jobs: state.jobs.map(job => job.id === id ? { ...job, status } : job)
        }));

        try {
            await apiClient.patch(`/jobs/${id}/status`, { status });
        } catch (error) {
            // Revert on failure
            set({ jobs: originalJobs });
            console.error('Failed to update job status:', error);
        }
    },

    deleteJob: async (id) => {
        const originalJobs = get().jobs;
        set((state) => ({
            jobs: state.jobs.filter(job => job.id !== id)
        }));

        try {
            await apiClient.delete(`/jobs/${id}`);
        } catch (error) {
            set({ jobs: originalJobs });
            console.error('Failed to delete job:', error);
        }
    }
}));
