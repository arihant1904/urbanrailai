import { create } from 'zustand';

export const useStore = create((set) => ({
  // Theme state
  theme: localStorage.getItem('theme') || 'dark-theme',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),

  // Application UI state
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Search state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Modal / Selection state
  selectedTrain: null,
  setSelectedTrain: (train) => set({ selectedTrain: train }),
}));
