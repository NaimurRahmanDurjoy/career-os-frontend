import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useReminderStore = create((set, get) => ({
    reminders: [],
    upcomingReminders: [],
    loading: false,
    error: null,

    fetchReminders: async () => {
        set({ loading: true, error: null });
        try {
            const response = await apiClient.get('/reminders');
            set({ reminders: response.data.reminders });
        } catch (error) {
            set({ error: 'Failed to fetch reminders' });
        } finally {
            set({ loading: false });
        }
    },

    fetchUpcoming: async () => {
        try {
            const response = await apiClient.get('/reminders/upcoming');
            set({ upcomingReminders: response.data.reminders });
        } catch (error) {
            console.error('Failed to fetch upcoming reminders', error);
        }
    },

    addReminder: async (data) => {
        try {
            await apiClient.post('/reminders', data);
            get().fetchUpcoming();
            get().fetchReminders();
            return true;
        } catch (error) {
            console.error('Failed to add reminder', error);
            throw error;
        }
    },

    markComplete: async (id) => {
        try {
            await apiClient.put(`/reminders/${id}`, { is_completed: true });
            get().fetchUpcoming();
            // Optimistic update for full list
            set(state => ({
                reminders: state.reminders.map(r => r.id === id ? { ...r, is_completed: true } : r)
            }));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    },

    deleteReminder: async (id) => {
        try {
            await apiClient.delete(`/reminders/${id}`);
            get().fetchUpcoming();
            set(state => ({
                reminders: state.reminders.filter(r => r.id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    }
}));
