import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { useAuthStore } from './authStore';
import { generateId } from '../lib/utils';

export const useEventsStore = create(
  persist(
    (set, get) => ({
      events: [],
      loading: false,

      fetchEvents: async (start, end) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            set({ loading: true });
            const params = start && end ? `?start=${start}&end=${end}` : '';
            const response = await api.get(`/events${params}`);
            set({ events: response.data, loading: false });
          } catch (error) {
            console.error('Failed to fetch events:', error);
            set({ loading: false });
          }
        } else {
          const guestEvents = JSON.parse(localStorage.getItem('guestEvents') || '[]');
          set({ events: guestEvents });
        }
      },

      createEvent: async (eventData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.post('/events', eventData);
            set((state) => ({ events: [...state.events, response.data.event] }));
            
            if (response.data.newXp) {
              useAuthStore.getState().updateUser({ 
                xp: response.data.newXp,
                level: response.data.newLevel,
              });
            }
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to create event' };
          }
        } else {
          const newEvent = { 
            id: generateId(), 
            ...eventData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updatedEvents = [...get().events, newEvent];
          set({ events: updatedEvents });
          localStorage.setItem('guestEvents', JSON.stringify(updatedEvents));
          return { success: true };
        }
      },

      updateEvent: async (id, eventData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.put(`/events/${id}`, eventData);
            set((state) => ({
              events: state.events.map((event) => 
                event.id === id ? response.data : event
              ),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to update event' };
          }
        } else {
          const updatedEvents = get().events.map((event) =>
            event.id === id ? { ...event, ...eventData, updatedAt: new Date().toISOString() } : event
          );
          set({ events: updatedEvents });
          localStorage.setItem('guestEvents', JSON.stringify(updatedEvents));
          return { success: true };
        }
      },

      deleteEvent: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await api.delete(`/events/${id}`);
            set((state) => ({
              events: state.events.filter((event) => event.id !== id),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to delete event' };
          }
        } else {
          const updatedEvents = get().events.filter((event) => event.id !== id);
          set({ events: updatedEvents });
          localStorage.setItem('guestEvents', JSON.stringify(updatedEvents));
          return { success: true };
        }
      },
    }),
    {
      name: 'events-storage',
      partialize: (state) => ({ events: state.events }),
    }
  )
);
