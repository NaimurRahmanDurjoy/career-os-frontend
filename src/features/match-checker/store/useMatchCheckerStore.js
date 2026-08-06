import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useMatchCheckerStore = create((set) => ({
    evaluationCache: null,
    coverLetterCache: null,
    isEvaluating: false,
    isGeneratingLetter: false,
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

    generateCoverLetter: async (resumeId, jdText) => {
        set({ isGeneratingLetter: true, error: null, coverLetterCache: null });
        try {
            const res = await apiClient.post('/ai-tools/stateless-cover-letter', {
                resume_id: resumeId,
                job_description: jdText
            });
            set({ coverLetterCache: res.data.cover_letter });
            return res.data.cover_letter;
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to generate cover letter.';
            set({ error: msg });
            throw new Error(msg);
        } finally {
            set({ isGeneratingLetter: false });
        }
    },

    clearEvaluation: () => set({ evaluationCache: null, coverLetterCache: null, error: null })
}));
