import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ScanLine, History, User, BookOpen, LogOut, X } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function Sidebar({ onLogout, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/scan', icon: ScanLine, label: 'Scan Fern' },
    { path: '/history', icon: History, label: 'Scan History' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/jupyter-info', icon: BookOpen, label: 'AI Info' }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className={`bg-white h-full flex flex-col ${isMobile ? 'w-full' : 'w-64'} border-r border-[var(--color-neutral-200)]`}>
      <div className="p-6 border-b border-[var(--color-neutral-200)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🌿</span>
          </div>
          <div>
            <h4 className="text-[var(--color-neutral-800)]">FernID</h4>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-white text-[var(--color-neutral-900)] shadow-sm [&_svg]:text-[var(--color-neutral-900)] [&_path]:stroke-[var(--color-neutral-900)]'
                : 'text-white hover:bg-white/10 [&_svg]:text-white [&_path]:stroke-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
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
