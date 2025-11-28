import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import { useAuthStore } from './authStore';
import { generateId } from '../lib/utils';

export const useTasksStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,

      fetchTasks: async () => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            set({ loading: true });
            const response = await api.get('/tasks');
            set({ tasks: response.data, loading: false });
          } catch (error) {
            console.error('Failed to fetch tasks:', error);
            set({ loading: false });
          }
        } else {
          const guestTasks = JSON.parse(localStorage.getItem('guestTasks') || '[]');
          set({ tasks: guestTasks });
        }
      },

      createTask: async (taskData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.post('/tasks', taskData);
            set((state) => ({ tasks: [response.data, ...state.tasks] }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to create task' };
          }
        } else {
          const newTask = { 
            id: generateId(), 
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updatedTasks = [newTask, ...get().tasks];
          set({ tasks: updatedTasks });
          localStorage.setItem('guestTasks', JSON.stringify(updatedTasks));
          return { success: true };
        }
      },

      updateTask: async (id, taskData) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            const response = await api.put(`/tasks/${id}`, taskData);
            set((state) => ({
              tasks: state.tasks.map((task) => 
                task.id === id ? response.data.task : task
              ),
            }));
            
            // Update XP if task was completed
            if (response.data.newXp) {
              useAuthStore.getState().updateUser({ 
                xp: response.data.newXp,
                level: response.data.newLevel,
              });
            }
            return { success: true, xpGained: response.data.xpGained };
          } catch (error) {
            return { success: false, error: 'Failed to update task' };
          }
        } else {
          const updatedTasks = get().tasks.map((task) =>
            task.id === id ? { ...task, ...taskData, updatedAt: new Date().toISOString() } : task
          );
          set({ tasks: updatedTasks });
          localStorage.setItem('guestTasks', JSON.stringify(updatedTasks));
          return { success: true };
        }
      },

      deleteTask: async (id) => {
        const { isAuthenticated } = useAuthStore.getState();
        
        if (isAuthenticated) {
          try {
            await api.delete(`/tasks/${id}`);
            set((state) => ({
              tasks: state.tasks.filter((task) => task.id !== id),
            }));
            return { success: true };
          } catch (error) {
            return { success: false, error: 'Failed to delete task' };
          }
        } else {
          const updatedTasks = get().tasks.filter((task) => task.id !== id);
          set({ tasks: updatedTasks });
          localStorage.setItem('guestTasks', JSON.stringify(updatedTasks));
          return { success: true };
        }
      },
    }),
    {
      name: 'tasks-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
