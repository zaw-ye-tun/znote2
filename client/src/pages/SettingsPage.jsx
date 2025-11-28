import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Avatar from '../components/Avatar';

export default function SettingsPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');

  const handleSaveProfile = async () => {
    // Profile update logic would go here
    alert('Profile updated!');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Section */}
      {isAuthenticated && user && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar level={user.level || 1} size="lg" />
              <div>
                <p className="font-medium text-lg">Level {user.level || 1}</p>
                <p className="text-sm text-gray-500">{user.xp || 0} XP</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="bg-gray-100 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </div>
      )}

      {/* Appearance */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-gray-500">
                Current: {theme === 'light' ? 'Light' : 'Dark'}
              </p>
            </div>
            <Button variant="secondary" onClick={toggleTheme}>
              Toggle Theme
            </Button>
          </div>
        </div>
      </div>

      {/* XP System Info */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">XP System</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Complete a task</span>
            <span className="font-medium text-green-600">+5 XP</span>
          </div>
          <div className="flex justify-between">
            <span>Create a note</span>
            <span className="font-medium text-green-600">+2 XP</span>
          </div>
          <div className="flex justify-between">
            <span>Add calendar event</span>
            <span className="font-medium text-green-600">+1 XP</span>
          </div>
          <div className="flex justify-between">
            <span>Daily login bonus</span>
            <span className="font-medium text-green-600">+10 XP</span>
          </div>
          <div className="flex justify-between">
            <span>Weekly streak bonus</span>
            <span className="font-medium text-green-600">+20 XP</span>
          </div>
        </div>
      </div>

      {/* Avatar Levels */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Avatar Evolution</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <Avatar level={1} size="md" />
            <p className="text-xs mt-2 text-gray-500">Level 1-4</p>
            <p className="text-xs font-medium">Dot</p>
          </div>
          <div className="text-center">
            <Avatar level={5} size="md" />
            <p className="text-xs mt-2 text-gray-500">Level 5-9</p>
            <p className="text-xs font-medium">Circle</p>
          </div>
          <div className="text-center">
            <Avatar level={10} size="md" />
            <p className="text-xs mt-2 text-gray-500">Level 10-14</p>
            <p className="text-xs font-medium">Triangle</p>
          </div>
          <div className="text-center">
            <Avatar level={15} size="md" />
            <p className="text-xs mt-2 text-gray-500">Level 15-19</p>
            <p className="text-xs font-medium">Square</p>
          </div>
          <div className="text-center">
            <Avatar level={20} size="md" />
            <p className="text-xs mt-2 text-gray-500">Level 20+</p>
            <p className="text-xs font-medium">Hexagon</p>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      {isAuthenticated && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Guest Mode</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You're using ZNOTE in guest mode. Data is saved locally. Create an account to sync across devices.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Create Account
          </Button>
        </div>
      )}

      {/* About */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">About ZNOTE</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ZNOTE is a minimalist, gamified productivity app for students, engineers, and anyone who values clean, efficient organization.
        </p>
        <p className="text-xs text-gray-500 mt-4">Version 1.0.0</p>
      </div>
    </div>
  );
}
