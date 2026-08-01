import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    isDarkMode: localStorage.getItem('theme') !== 'light',
    toggleTheme: () => set((state) => {
        const nextMode = !state.isDarkMode;
        localStorage.setItem('theme', nextMode ? 'dark' : 'light');
        if (nextMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: nextMode };
    }),
    initTheme: () => {
        const isDark = localStorage.getItem('theme') !== 'light';
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }
}));
