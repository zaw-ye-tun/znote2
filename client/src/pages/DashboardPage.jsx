import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTasksStore } from '../stores/tasksStore';
import { useNotesStore } from '../stores/notesStore';
import { useEventsStore } from '../stores/eventsStore';
import { CheckSquare, FileText, Calendar, TrendingUp } from 'lucide-react';
import Avatar from '../components/Avatar';
import { formatDate, getWeekNumber } from '../lib/utils';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const tasks = useTasksStore((state) => state.tasks);
  const notes = useNotesStore((state) => state.notes);
  const events = useEventsStore((state) => state.events);

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.dueDate)
    .slice(0, 5);

  const recentNotes = notes.slice(0, 3);

  const todayEvents = events.filter((event) => {
    const today = new Date();
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  });

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const weekNumber = getWeekNumber(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{isAuthenticated && user ? `, ${user.username}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • Week {weekNumber}
          </p>
        </div>
        {isAuthenticated && user && (
          <Avatar level={user.level || 1} size="lg" />
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckSquare className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks</p>
              <p className="text-2xl font-bold">{completedTasksCount}/{tasks.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
              <p className="text-2xl font-bold">{notes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Events</p>
              <p className="text-2xl font-bold">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
              <p className="text-2xl font-bold">🔥 {user?.streak || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
          {todayTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks due today</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notes */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
          {recentNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notes yet</p>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <h3 className="font-medium">{note.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Upcoming Tasks</h2>
        {upcomingTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
        ) : (
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between"
              >
                <span>{task.title}</span>
                <span className="text-sm text-gray-500">
                  {formatDate(task.dueDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
