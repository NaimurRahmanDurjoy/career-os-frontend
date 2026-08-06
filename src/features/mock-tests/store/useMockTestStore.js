import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useMockTestStore = create((set, get) => ({
    tests: [],
    loading: false,
    generating: false,
    error: null,

    fetchTests: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get('/mock-tests');
            set({ tests: res.data });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch tests' });
        } finally {
            set({ loading: false });
        }
    },

    generateTest: async (topicName) => {
        set({ generating: true, error: null });
        try {
            const res = await apiClient.post('/mock-tests/generate', { topic_name: topicName });
            set(state => ({ tests: [res.data, ...state.tests] }));
            return res.data;
        } catch (error) {
            console.error('Failed to generate test', error);
            set({ error: error.response?.data?.message || 'Failed to generate test' });
            throw error;
        } finally {
            set({ generating: false });
        }
    },

    submitTest: async (id, answersMap) => {
        set({ loading: true });
        try {
            const res = await apiClient.post(`/mock-tests/${id}/submit`, { user_answers: answersMap });
            set(state => ({
                tests: state.tests.map(t => t.id === id ? res.data : t)
            }));
            return res.data;
        } catch (error) {
            console.error('Failed to submit test', error);
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    deleteTest: async (id) => {
        try {
            await apiClient.delete(`/mock-tests/${id}`);
            set(state => ({
                tests: state.tests.filter(t => t.id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete test', error);
            throw error;
        }
    }
}));
