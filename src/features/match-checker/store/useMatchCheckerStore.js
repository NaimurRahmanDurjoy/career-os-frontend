import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useMatchCheckerStore = create((set) => ({
    evaluationCache: null,
    isEvaluating: false,
    error: null,

    evaluateMatch: async (resumeId, jdText) => {
        set({ isEvaluating: true, error: null, evaluationCache: null });
        try {
            const res = await apiClient.post('/ai-tools/evaluate-match', {
                resume_id: resumeId,
                job_description: jdText
            });
            set({ evaluationCache: res.data.evaluation });
            return res.data.evaluation;
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to evaluate match.';
            set({ error: msg });
            throw new Error(msg);
        } finally {
            set({ isEvaluating: false });
        }
    },

    clearEvaluation: () => set({ evaluationCache: null, error: null })
}));
