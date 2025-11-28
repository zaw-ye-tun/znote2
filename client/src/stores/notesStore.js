import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { useAuthStore } from './authStore';
import { generateId } from '../lib/utils';

export const useNotesStore = create(
  persist(
    (set, get) => ({
      notes: [],
      loading: false,

      fetchNotes: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            set({ loading: true });
            const response = await api.get('/notes');
            set({ notes: response.data, loading: false });
          } catch (error) {
            console.error('Failed to fetch notes:', error);
            set({ loading: false });
          }
        } else {
          // Load from localStorage for guest
          const guestNotes = JSON.parse(localStorage.getItem('guestNotes') || '[]');
          set({ notes: guestNotes });
        }
      },

      createNote: async (noteData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.post('/notes', noteData);
            set((state) => ({ notes: [response.data.note, ...state.notes] }));
            
            // Update XP
            if (response.data.newXp) {
              useAuthStore.getState().updateUser({ 
                xp: response.data.newXp,
                level: response.data.newLevel,
              });
            }
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to create note' };
          }
        } else {
          // Save to localStorage for guest
          const newNote = { 
            id: generateId(), 
            ...noteData, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updatedNotes = [newNote, ...get().notes];
          set({ notes: updatedNotes });
          localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
          return { success: true };
        }
      },

      updateNote: async (id, noteData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.put(`/notes/${id}`, noteData);
            set((state) => ({
              notes: state.notes.map((note) => 
                note.id === id ? response.data : note
              ),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to update note' };
          }
        } else {
          const updatedNotes = get().notes.map((note) =>
            note.id === id ? { ...note, ...noteData, updatedAt: new Date().toISOString() } : note
          );
          set({ notes: updatedNotes });
          localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
          return { success: true };
        }
      },

      deleteNote: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await api.delete(`/notes/${id}`);
            set((state) => ({
              notes: state.notes.filter((note) => note.id !== id),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to delete note' };
          }
        } else {
          const updatedNotes = get().notes.filter((note) => note.id !== id);
          set({ notes: updatedNotes });
          localStorage.setItem('guestNotes', JSON.stringify(updatedNotes));
          return { success: true };
        }
      },
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({ notes: state.notes }),
    }
  )
);
