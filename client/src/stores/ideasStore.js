import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { useAuthStore } from './authStore';
import { generateId } from '../lib/utils';

export const useIdeasStore = create(
  persist(
    (set, get) => ({
      ideas: [],
      loading: false,

      fetchIdeas: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            set({ loading: true });
            const response = await api.get('/ideas');
            set({ ideas: response.data, loading: false });
          } catch (error) {
            console.error('Failed to fetch ideas:', error);
            set({ loading: false });
          }
        } else {
          const guestIdeas = JSON.parse(localStorage.getItem('guestIdeas') || '[]');
          set({ ideas: guestIdeas });
        }
      },

      createIdea: async (ideaData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.post('/ideas', ideaData);
            set((state) => ({ ideas: [response.data, ...state.ideas] }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to create idea' };
          }
        } else {
          const newIdea = { 
            id: generateId(), 
            ...ideaData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updatedIdeas = [newIdea, ...get().ideas];
          set({ ideas: updatedIdeas });
          localStorage.setItem('guestIdeas', JSON.stringify(updatedIdeas));
          return { success: true };
        }
      },

      updateIdea: async (id, ideaData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.put(`/ideas/${id}`, ideaData);
            set((state) => ({
              ideas: state.ideas.map((idea) => 
                idea.id === id ? response.data : idea
              ),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to update idea' };
          }
        } else {
          const updatedIdeas = get().ideas.map((idea) =>
            idea.id === id ? { ...idea, ...ideaData, updatedAt: new Date().toISOString() } : idea
          );
          set({ ideas: updatedIdeas });
          localStorage.setItem('guestIdeas', JSON.stringify(updatedIdeas));
          return { success: true };
        }
      },

      deleteIdea: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await api.delete(`/ideas/${id}`);
            set((state) => ({
              ideas: state.ideas.filter((idea) => idea.id !== id),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to delete idea' };
          }
        } else {
          const updatedIdeas = get().ideas.filter((idea) => idea.id !== id);
          set({ ideas: updatedIdeas });
          localStorage.setItem('guestIdeas', JSON.stringify(updatedIdeas));
          return { success: true };
        }
      },
    }),
    {
      name: 'ideas-storage',
      partialize: (state) => ({ ideas: state.ideas }),
    }
  )
);
