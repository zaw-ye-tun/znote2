import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../stores/authStore';
import { useNotesStore } from '../stores/notesStore';
import { useTasksStore } from '../stores/tasksStore';
import { useIdeasStore } from '../stores/ideasStore';
import { useEventsStore } from '../stores/eventsStore';

export default function Layout() {
  const navigate = useNavigate();
  const { isGuest } = useAuthStore();
  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const fetchTasks = useTasksStore((state) => state.fetchTasks);
  const fetchIdeas = useIdeasStore((state) => state.fetchIdeas);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);

  useEffect(() => {
    // Fetch all data on mount
    fetchNotes();
    fetchTasks();
    fetchIdeas();
    fetchEvents();
  }, [fetchNotes, fetchTasks, fetchIdeas, fetchEvents]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
