import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useDashboardStore = create((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/dashboard/stats');
            set({ stats: response.data, loading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch dashboard stats', loading: false });
        }
    }
}));
