import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, Leaf, FileText, Settings, LogOut, X } from 'lucide-react';
import type { User } from '../types';

interface AdminSidebarProps {
  onLogout: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  user?: User | null;
}

const navItems = [
  { 
    path: '/admin', 
    icon: LayoutDashboard, 
    label: 'Dashboard',
    permission: 'viewAnalytics'
  },
  { 
    path: '/admin/users', 
    icon: Users, 
    label: 'User Management',
    permission: 'manageUsers'
  },
  { 
    path: '/admin/species', 
    icon: Leaf, 
    label: 'Fern Species',
    permission: 'manageContent'
  },
  { 
    path: '/admin/scans', 
    icon: FileText, 
    label: 'Scan Logs',
    permission: 'viewAnalytics'
  },
  { 
    path: '/admin/settings', 
    icon: Settings, 
    label: 'Settings',
    permission: 'systemSettings'
  }
];

export default function AdminSidebar({ onLogout, onClose, isMobile = false, user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Get current user from localStorage if not provided (client-side only)
    const storedUser = user || JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('currentUser') || 'null' : 'null');
    setCurrentUser(storedUser);
  }, [user]);
  
  // Check if user has permission to view a nav item
  const hasPermission = (permission: string) => {
    if (!currentUser || currentUser.role !== 'admin') return false;
    // If no specific permissions are set (legacy admin), show all items
    if (!currentUser.adminPermissions) return true;
    return currentUser.adminPermissions[permission as keyof typeof currentUser.adminPermissions] === true;
  };
  
  const filteredNavItems = currentUser ? navItems.filter(item => hasPermission(item.permission)) : [];

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`bg-white ${isMobile ? 'h-screen' : 'h-full'} flex flex-col ${isMobile ? 'w-full' : 'w-64'} border-r border-[var(--color-neutral-200)]`}>
      <div className="p-6 border-b border-[var(--color-neutral-200)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🔧</span>
          </div>
          <div>
            <h4 className="text-[var(--color-neutral-800)]">Admin Panel</h4>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isItemActive = isActive(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isItemActive
                  ? 'bg-white text-[var(--color-neutral-900)] shadow-sm [&_svg]:text-[var(--color-neutral-900)] [&_path]:stroke-[var(--color-neutral-900)]'
                  : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)] [&_svg]:text-[var(--color-neutral-700)] [&_path]:stroke-[var(--color-neutral-700)]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-neutral-200)]">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-[var(--color-error)] hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
