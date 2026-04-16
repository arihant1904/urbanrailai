import { useEffect } from 'react';
import { create } from 'zustand';
import { mockTrainData } from '../data/mockTrainData';

const API_BASE_URL = '/api';

// Create a global store for train telemetry
export const useTrainsStore = create((set, get) => ({
  trains: [],
  loading: true,
  error: null,
  hasFetched: false,

  fetchTrains: async () => {
    try {
      if (!get().hasFetched) set({ loading: true });
      const response = await fetch(`${API_BASE_URL}/trains`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      set({ trains: data, error: null, hasFetched: true });
    } catch (err) {
      set({ trains: mockTrainData, error: 'Offline Mode', hasFetched: true });
    } finally {
      if (get().loading) set({ loading: false });
    }
  },

  fixTrainIssue: async (id) => {
    try {
      await fetch(`${API_BASE_URL}/optimize?train_id=${id}`, { method: 'POST' });
      get().fetchTrains(); // Re-fetch immediately
    } catch (err) {
      // Fallback
      set((state) => ({
        trains: state.trains.map(t => 
          t.id === id ? { 
            ...t, 
            delayMinutes: 0, 
            status: 'On Time', 
            maintenanceStatus: 'Healthy', 
            isAIFixed: true 
          } : t
        )
      }));
    }
  }
}));

export const useTrainsData = () => {
  const store = useTrainsStore();
  
  useEffect(() => {
    store.fetchTrains();
    
    // Setup AI polling interval
    const interval = setInterval(() => {
      store.fetchTrains();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { 
    trains: store.trains, 
    loading: store.loading, 
    error: store.error,
    fixTrainIssue: store.fixTrainIssue
  };
};
