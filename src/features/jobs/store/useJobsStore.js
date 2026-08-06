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
    },

    // --- Notes Actions ---
    fetchNotes: async (jobId) => {
        try {
            const response = await apiClient.get(`/jobs/${jobId}/notes`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notes:', error);
            throw error;
        }
    },

    addNote: async (jobId, title, content) => {
        try {
            const response = await apiClient.post(`/jobs/${jobId}/notes`, { title, content });
            return response.data;
        } catch (error) {
            console.error('Failed to add note:', error);
            throw error;
        }
    },

    deleteNote: async (noteId) => {
        try {
            await apiClient.delete(`/notes/${noteId}`);
        } catch (error) {
            console.error('Failed to delete note:', error);
            throw error;
        }
    },

    // --- AI Job Match Actions ---
    analyzeJobMatch: async (jobId) => {
        try {
            const response = await apiClient.post(`/jobs/${jobId}/ai-match`);
            return response.data;
        } catch (error) {
            console.error('Failed to start AI match analysis:', error);
            throw error;
        }
    },

    fetchJobMatch: async (jobId) => {
        try {
            const response = await apiClient.get(`/jobs/${jobId}/ai-match`);
            return response.data;
        } catch (error) {
            // Note: 404 is expected if no match has been run yet
            if (error.response?.status !== 404) {
                console.error('Failed to fetch job match:', error);
            }
            return null;
        }
    }
}));
