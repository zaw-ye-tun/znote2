import { NavLink } from 'react-router-dom';
import { Home, FileText, CheckSquare, Lightbulb, Calendar, Settings, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import Avatar from './Avatar';

export default function Sidebar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const links = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/notes', icon: FileText, label: 'Notes' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/ideas', icon: Lightbulb, label: 'Ideas' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>
    );
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-600">ZNOTE</h1>
        <button onClick={toggleSidebar} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Menu size={20} />
        </button>
      </div>

      {isAuthenticated && user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar level={user.level || 1} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.username}</p>
              <p className="text-sm text-gray-500">Level {user.level || 1}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>XP: {user.xp || 0}</span>
              <span>{Math.ceil((user.level || 1) * 100 - (user.xp || 0))} to next</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-600 transition-all duration-300"
                style={{ width: `${((user.xp || 0) % 100)}%` }}
              />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            🔥 Streak: {user.streak || 0} days
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
