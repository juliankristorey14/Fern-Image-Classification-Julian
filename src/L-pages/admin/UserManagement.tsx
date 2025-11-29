import { useState, useEffect } from 'react';
import { Menu, Search, Edit, Trash2, UserPlus, Shield, Ban, User as UserIcon, Check } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import { getAllUsers, promoteUser, deleteUser, updateUserRole } from '@/utils/admin';
import { getUserScans } from '@/utils/scans';
import type { User as UserType } from '@/types';

interface UserManagementProps {
  onLogout: () => void;
}

export default function UserManagement({ onLogout }: UserManagementProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [modalAction, setModalAction] = useState<'delete' | 'deactivate' | 'promote' | 'demote' | 'edit' | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userScanCounts, setUserScanCounts] = useState<Record<string, number>>({});
  const [adminPermissions, setAdminPermissions] = useState({
    manageUsers: true,
    manageContent: true,
    viewAnalytics: true,
    systemSettings: false
  });
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [userToPromote, setUserToPromote] = useState<string | null>(null);
  const [deactivatedIds, setDeactivatedIds] = useState<Set<string>>(() => new Set<string>());

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  useEffect(() => {
    const loadUserScanCounts = async () => {
      const counts: Record<string, number> = {};
      await Promise.all(
        users.map(async (user) => {
          const scans = await getUserScans(user.id);
          counts[user.id] = scans.length;
        })
      );
      setUserScanCounts(counts);
    };

    if (users.length > 0) {
      loadUserScanCounts();
    }
  }, [users]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem('adminDeactivatedUsers');
    if (raw) {
      setDeactivatedIds(new Set<string>(JSON.parse(raw)));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('adminDeactivatedUsers', JSON.stringify(Array.from(deactivatedIds)));
  }, [deactivatedIds]);

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  const handleLogoutClick = () => {
    onLogout();
  };

  const handleAction = async () => {
  if (!selectedUser || !modalAction) return;

  if (modalAction === 'promote') {
    setUserToPromote(selectedUser);
    setShowPermissionsModal(true);
    return;
  } else if (modalAction === 'delete') {
    const ok = await deleteUser(selectedUser);
    if (ok) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser));
      // Also clear if deactivated locally
      setDeactivatedIds(prev => {
        const copy = new Set(prev);
        copy.delete(selectedUser);
        return copy;
      });
    }
  } else if (modalAction === 'demote') {
    const ok = await updateUserRole(selectedUser, 'user');
    if (ok) {
      const updated = await getAllUsers();
      setUsers(updated);
    }
  } else if (modalAction === 'deactivate') {
    setDeactivatedIds(prev => {
      const next = new Set(prev);
      if (next.has(selectedUser)) {
        next.delete(selectedUser); // Reactivate
      } else {
        next.add(selectedUser); // Deactivate
      }
      return next;
    });
  }
  setModalAction(null);
  setSelectedUser(null);
};

  return (
    <div className="flex h-screen bg-[var(--color-neutral-100)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar onLogout={handleLogoutClick} user={currentUser} />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-72">
            <AdminSidebar 
              onLogout={handleLogoutClick} 
              onClose={() => setIsSidebarOpen(false)} 
              isMobile 
              user={currentUser}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <div className="bg-white border-b border-[var(--color-neutral-200)] px-4 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-900)]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-[var(--color-neutral-800)]">User Management</h2>
            <div className="w-6 lg:w-0"></div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-[var(--color-neutral-800)]">All Users</h3>
                <p className="text-[var(--color-neutral-600)]">
                  {users.length} total users
                </p>
              </div>
              <Button variant="primary">
                <UserPlus className="w-5 h-5" />
                Add User
              </Button>
            </div>

            {/* Search */}
            <Card padding="md">
              <Input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </Card>

            {/* Users Table */}
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--color-neutral-100)] border-b border-[var(--color-neutral-200)]">
                    <tr>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Role
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Scans
                      </th>
                      <th className="text-left px-6 py-4 text-[var(--color-neutral-700)]">
                        Joined
                      </th>
                      <th className="text-right px-6 py-4 text-[var(--color-neutral-700)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-neutral-200)]">
                    {filteredUsers.map((user) => {
                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-[var(--color-neutral-50)] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white ${deactivatedIds.has(user.id) ? 'opacity-50' : ''}`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <span className={`text-[var(--color-neutral-800)] ${deactivatedIds.has(user.id) ? 'opacity-60 line-through' : ''}`}>
                                {user.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[var(--color-neutral-600)]">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {user.role === 'admin' && <Shield className="w-3 h-3" />}
                              {user.role}
                              {deactivatedIds.has(user.id) && <span className="ml-2 text-[var(--color-neutral-600)]">(deactivated)</span>}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[var(--color-neutral-600)]">
                            {userScanCounts[user.id] || 0}
                          </td>
                          <td className="px-6 py-4 text-[var(--color-neutral-600)]">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user.id);
                                  setEditUsername(user.username);
                                  setEditEmail(user.email);
                                  setModalAction('edit');
                                }}
                                className="p-2 text-[var(--color-neutral-600)] hover:text-[var(--color-primary)] hover:bg-[var(--color-neutral-100)] rounded-lg transition-colors"
                                title="Edit user"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {user.role === 'admin' ? (
                                <button
                                  onClick={() => {
                                    setSelectedUser(user.id);
                                    setModalAction('demote');
                                  }}
                                  className="p-2 text-[var(--color-neutral-600)] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Demote to regular user"
                                >
                                  <UserIcon className="w-4 h-4" />
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user.id);
                                      setModalAction('promote');
                                    }}
                                    className="p-2 text-[var(--color-neutral-600)] hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Promote to admin"
                                  >
                                    <Shield className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUser(user.id);
                                      setModalAction('deactivate');
                                    }}
                                    className={`p-2 rounded-lg transition-colors ${deactivatedIds.has(user.id) ? 'text-green-600 hover:bg-green-50' : 'text-[var(--color-neutral-600)] hover:text-orange-600 hover:bg-orange-50'}`}
                                    title={deactivatedIds.has(user.id) ? 'Reactivate user' : 'Deactivate user'}
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedUser(user.id);
                                  setModalAction('delete');
                                }}
                                className="p-2 text-[var(--color-neutral-600)] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Action Modals */}
      <Modal
        isOpen={modalAction === 'delete'}
        onClose={() => {
          setModalAction(null);
          setSelectedUser(null);
        }}
        title="Delete User"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleAction}>
              Delete User
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to delete this user? This action cannot be undone and will remove all their scan history.</p>
      </Modal>

      <Modal
        isOpen={modalAction === 'deactivate'}
        onClose={() => {
          setModalAction(null);
          setSelectedUser(null);
        }}
        title="Deactivate User"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={handleAction}>
              Deactivate
            </Button>
          </div>
        }
      >
        <p>This will prevent the user from accessing their account. They can be reactivated later.</p>
      </Modal>

      <Modal
        isOpen={modalAction === 'edit'}
        onClose={() => {
          setModalAction(null);
          setSelectedUser(null);
        }}
        title="Edit User"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                // Save any changes made to username/email here if needed
                setModalAction(null);
                setSelectedUser(null);
              }}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div>
              <p className="font-medium text-gray-900">Admin Privileges</p>
              <p className="text-sm text-gray-500 mt-1">
                {users.find(u => u.id === selectedUser)?.role === 'admin' 
                  ? 'This user has administrator privileges.' 
                  : 'This user has standard user privileges.'}
              </p>
            </div>
            <div 
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${users.find(u => u.id === selectedUser)?.role === 'admin' ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={async (e) => {
                e.stopPropagation();
                if (!selectedUser) return;
                const user = users.find(u => u.id === selectedUser);
                if (user) {
                  const newRole = user.role === 'admin' ? 'user' : 'admin';
                  await updateUserRole(selectedUser, newRole);
                  const updatedUsers = await getAllUsers();
                  setUsers(updatedUsers);
                }
              }}
            >
              <span
                className={`${users.find(u => u.id === selectedUser)?.role === 'admin' ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </div>
          </div>
          <Input
            type="text"
            label="Username"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
          <Input
            type="email"
            label="Email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={modalAction === 'promote'}
        onClose={() => {
          setModalAction(null);
          setSelectedUser(null);
        }}
        title="Promote to Admin"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => {
                setShowPermissionsModal(true);
              }}
            >
              Set Permissions
            </Button>
          </div>
        }
      >
        <p>This will grant the user administrator privileges. Click 'Set Permissions' to choose which admin features they can access.</p>
      </Modal>

      {/* Admin Permissions Modal */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title="Set Admin Permissions"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowPermissionsModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                if (selectedUser) {
                  const ok = await promoteUser(selectedUser, adminPermissions);
                  if (ok) {
                    const updated = await getAllUsers();
                    setUsers(updated);
                  }
                  setShowPermissionsModal(false);
                  setModalAction(null);
                  setSelectedUser(null);
                }
              }}
            >
              Confirm Permissions
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Select the permissions to grant to this admin:
          </p>
          
          {Object.entries(adminPermissions).map(([key, value]) => (
            <label key={key} className="flex items-center space-x-3 p-3 pr-6 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${value ? 'bg-[#1E6709]' : 'border-2 border-gray-300'}`} style={value ? { backgroundColor: '#1E6709' } : {}}>
                {value && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
              <input
                type="checkbox"
                checked={value}
                onChange={() => {
                  setAdminPermissions(prev => ({
                    ...prev,
                    [key]: !value
                  }));
                }}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={modalAction === 'demote'}
        onClose={() => {
          setModalAction(null);
          setSelectedUser(null);
        }}
        title="Demote to Regular User"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setModalAction(null);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" fullWidth onClick={handleAction}>
              Demote to User
            </Button>
          </div>
        }
      >
        <p>This will revoke the user's administrator privileges. They will no longer have access to the admin panel.</p>
      </Modal>
    </div>
  );
}
