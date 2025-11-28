import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: true,

      register: async (email, password, username) => {
        try {
          const response = await api.post('/auth/register', { email, password, username });
          const { token, user } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isGuest: false });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
      },

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user, xpGained } = response.data;
          
          localStorage.setItem('token', token);
          set({ user, token, isAuthenticated: true, isGuest: false });
          return { success: true, xpGained };
        } catch (error) {
          return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isGuest: true });
      },

      continueAsGuest: () => {
        set({ isGuest: true, isAuthenticated: false });
      },

      syncGuestData: async (guestData) => {
        try {
          await api.post('/auth/sync', guestData);
          // Clear local storage after sync
          localStorage.removeItem('guestNotes');
          localStorage.removeItem('guestTasks');
          localStorage.removeItem('guestIdeas');
          localStorage.removeItem('guestEvents');
          return { success: true };
        } catch (error) {
          return { success: false, error: 'Failed to sync data' };
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
