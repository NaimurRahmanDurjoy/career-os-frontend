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

    // --- Contacts (CRM) ---
    fetchContacts: async (jobId) => {
        try {
            const response = await apiClient.get(`/jobs/${jobId}/contacts`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            throw error;
        }
    },

    addContact: async (jobId, contactData) => {
        try {
            const response = await apiClient.post(`/jobs/${jobId}/contacts`, contactData);
            return response.data;
        } catch (error) {
            console.error('Failed to add contact:', error);
            throw error;
        }
    },

    updateContact: async (contactId, contactData) => {
        try {
            const response = await apiClient.put(`/contacts/${contactId}`, contactData);
            return response.data;
        } catch (error) {
            console.error('Failed to update contact:', error);
            throw error;
        }
    },

    deleteContact: async (contactId) => {
        try {
            await apiClient.delete(`/contacts/${contactId}`);
        } catch (error) {
            console.error('Failed to delete contact:', error);
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
    },

    // --- AI Generator Actions ---
    fetchCoverLetter: async (jobId) => {
        try {
            const response = await apiClient.get(`/jobs/${jobId}/cover-letters`);
            return response.data.cover_letter;
        } catch (error) {
            console.error('Failed to fetch cover letter:', error);
            return null;
        }
    },

    generateCoverLetter: async (jobId) => {
        try {
            const response = await apiClient.post(`/jobs/${jobId}/cover-letters/generate`);
            return response.data;
        } catch (error) {
            console.error('Failed to generate cover letter:', error);
            throw error;
        }
    },

    saveManualCoverLetter: async (jobId, text) => {
        try {
            await apiClient.put(`/jobs/${jobId}/cover-letters`, { content: text });
            return true;
        } catch (error) {
            console.error('Failed to manually save cover letter:', error);
            throw error;
        }
    },

    generateInterviewPrep: async (jobId) => {
        try {
            const response = await apiClient.post('/ai-tools/interview-questions', { job_application_id: jobId });
            return response.data;
        } catch (error) {
            console.error('Failed to generate interview prep:', error);
            throw error;
        }
    },

    analyzeRejection: async (jobId) => {
        try {
            const response = await apiClient.post('/ai-tools/rejection-analysis', { job_application_id: jobId });
            return response.data.analysis;
        } catch (error) {
            console.error('Failed to analyze rejection:', error);
            throw error;
        }
    },

    generateNegotiationTips: async (jobId) => {
        try {
            const response = await apiClient.post('/ai-tools/salary-negotiation', { job_application_id: jobId });
            return response.data.negotiation;
        } catch (error) {
            console.error('Failed to generate negotiation tips:', error);
            throw error;
        }
    }
}));
