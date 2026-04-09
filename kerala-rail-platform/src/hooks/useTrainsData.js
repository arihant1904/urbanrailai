import { useEffect } from 'react';
import { create } from 'zustand';
import { mockTrainData } from '../data/mockTrainData';

const API_BASE_URL = 'http://localhost:5000/api';

// Create a global store for train telemetry
export const useTrainsStore = create((set, get) => ({
  trains: [],
  loading: true,
  error: null,
  hasFetched: false,

  fetchTrains: async () => {
    if (get().hasFetched) return; // Prevent 7 components fetching at once
    try {
      set({ loading: true, hasFetched: true });
      const response = await fetch(`${API_BASE_URL}/trains`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      set({ trains: data, error: null });
    } catch (err) {
      set({ trains: mockTrainData, error: 'Offline Mode' });
    } finally {
      set({ loading: false });
    }
  },

  fixTrainIssue: (id) => set((state) => ({
    trains: state.trains.map(t => 
      t.id === id ? { 
        ...t, 
        delayMinutes: 0, 
        status: 'On Time', 
        maintenanceStatus: 'Healthy', 
        isAIFixed: true 
      } : t
    )
  }))
}));

// Provide identical custom hook API for the existing 7 components
export const useTrainsData = () => {
  const store = useTrainsStore();
  
  useEffect(() => {
    store.fetchTrains();
  }, []); // Component triggers fetch automatically

  return { 
    trains: store.trains, 
    loading: store.loading, 
    error: store.error,
    fixTrainIssue: store.fixTrainIssue
  };
};
