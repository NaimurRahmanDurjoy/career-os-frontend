import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';

export const useChatStore = create((set, get) => ({
    messages: [
        { role: 'assistant', content: "Hi! I'm your CareerOS AI Assistant. I have access to your primary resume. How can I help you today?" }
    ],
    isLoading: false,
    isOpen: false,

    toggleChat: () => set(state => ({ isOpen: !state.isOpen })),

    sendMessage: async (content) => {
        const userMsg = { role: 'user', content };
        set(state => ({
            messages: [...state.messages, userMsg],
            isLoading: true
        }));

        try {
            const contextToSend = get().messages.filter(m => m.role !== 'system');

            const response = await apiClient.post('/chat/completions', {
                messages: contextToSend
            });

            if (response.data.success) {
                set(state => ({
                    messages: [...state.messages, response.data.message]
                }));
            }
        } catch (error) {
            set(state => ({
                messages: [...state.messages, {
                    role: 'assistant',
                    content: error.response?.data?.message || "Sorry, I encountered an error connecting to the AI brain."
                }]
            }));
        } finally {
            set({ isLoading: false });
        }
    }
}));
