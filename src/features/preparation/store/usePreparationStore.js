import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const usePreparationStore = create((set, get) => ({
    trackers: [],
    loading: false,
    error: null,

    fetchTrackers: async () => {
        set({ loading: true, error: null });
        try {
            const res = await apiClient.get('/preparation-trackers');
            set({ trackers: res.data });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Failed to fetch trackers' });
        } finally {
            set({ loading: false });
        }
    },

    createTracker: async (examType) => {
        try {
            const res = await apiClient.post('/preparation-trackers', { exam_type: examType });
            set(state => ({ trackers: [res.data, ...state.trackers] }));
            return res.data;
        } catch (error) {
            console.error('Failed to create tracker', error);
            throw error;
        }
    },

    updateTracker: async (id, data) => {
        try {
            const res = await apiClient.put(`/preparation-trackers/${id}`, data);
            set(state => ({
                trackers: state.trackers.map(t => t.id === id ? res.data : t)
            }));
            return res.data;
        } catch (error) {
            console.error('Failed to update tracker', error);
            throw error;
        }
    },

    deleteTracker: async (id) => {
        try {
            await apiClient.delete(`/preparation-trackers/${id}`);
            set(state => ({
                trackers: state.trackers.filter(t => t.id !== id)
            }));
        } catch (error) {
            console.error('Failed to delete tracker', error);
            throw error;
        }
    },

    toggleTopic: async (trackerId, moduleIndex, topicIndex) => {
        const tracker = get().trackers.find(t => t.id === trackerId);
        if (!tracker) return;

        // Deep clone the roadmap
        const roadmap = JSON.parse(JSON.stringify(tracker.syllabus_roadmap));
        const module = roadmap[moduleIndex];

        // Toggle the topic
        const isCompleted = !module.topics[topicIndex].completed;
        module.topics[topicIndex].completed = isCompleted;

        // Recalculate module progress
        const completedTopics = module.topics.filter(t => t.completed).length;
        module.progress = (completedTopics / module.topics.length) * 100;

        // Recalculate overall progress
        let totalTopics = 0;
        let totalCompleted = 0;
        roadmap.forEach(m => {
            totalTopics += m.topics.length;
            totalCompleted += m.topics.filter(t => t.completed).length;
        });
        const overallProgress = totalTopics === 0 ? 0 : Math.round((totalCompleted / totalTopics) * 100);

        // Optimistic UI update
        set(state => ({
            trackers: state.trackers.map(t => t.id === trackerId ? { ...t, syllabus_roadmap: roadmap, overall_progress: overallProgress } : t)
        }));

        // Persist to backend
        try {
            await apiClient.put(`/preparation-trackers/${trackerId}`, {
                syllabus_roadmap: roadmap,
                overall_progress: overallProgress
            });
        } catch (error) {
            console.error("Failed to sync progress:", error);
            // Revert state on failure
            get().fetchTrackers();
        }
    }
}));
