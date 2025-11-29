import { useState, useRef } from 'react';
import { Mail, User as UserIcon, Lock, Camera } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';
import type { User } from '@/types';

interface ProfilePageProps {
  user: User;
  onLogout: () => void;
  onUpdate: (user: User) => void;
}

export default function ProfilePage({ user, onLogout, onUpdate }: ProfilePageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempProfilePicture, setTempProfilePicture] = useState<string | undefined>(undefined);

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTempProfilePicture(reader.result as string);
      setSuccess('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        username,
        email,
        profilePicture: tempProfilePicture ?? user.profilePicture
      };
      onUpdate(updatedUser);
      setSuccess('Profile updated successfully!');
      setTempProfilePicture(undefined);
    }, 500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 500);
  };

  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onLogout={handleLogoutClick} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              onLogout={handleLogoutClick}
              onClose={() => setIsSidebarOpen(false)}
              isMobile
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav username={user.username} profilePicture={user.profilePicture} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-[var(--color-neutral-800)] mb-2">Profile Settings</h1>
              <p className="text-[var(--color-neutral-600)]">
                Manage your account information and preferences
              </p>
            </div>

            {/* Alerts */}
            {success && (
              <Alert type="success" onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}

            {error && (
              <Alert type="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Profile Picture */}
            <Card padding="lg">
              <div className="flex items-center gap-6">
                {(tempProfilePicture ?? user.profilePicture) ? (
                  <img
                    src={(tempProfilePicture ?? user.profilePicture) as string}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-3xl">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-[var(--color-neutral-800)] mb-1">{user.username}</h3>
                  <p className="text-[var(--color-neutral-600)] mb-3">{user.email}</p>
                  <Button variant="ghost" size="sm" onClick={handleChangePhotoClick}>
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelected}
                  />
                </div>
              </div>
            </Card>

            {/* Profile Information */}
            <Card padding="lg">
              <h3 className="text-[var(--color-neutral-800)] mb-4">Profile Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  icon={<UserIcon className="w-5 h-5" />}
                />
                <Input
                  type="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-5 h-5" />}
                />
                <div className="pt-2">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>

            {/* Change Password */}
            <Card padding="lg">
              <h3 className="text-[var(--color-neutral-800)] mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                />
                <Input
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-5 h-5" />}
                />
                <div className="pt-2">
                  <Button type="submit" variant="primary">
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>

            {/* Account Actions */}
            <Card padding="lg">
              <h3 className="text-[var(--color-neutral-800)] mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Button variant="ghost" fullWidth onClick={handleLogoutClick}>
                  Sign Out
                </Button>
                <Button variant="danger" fullWidth>
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}