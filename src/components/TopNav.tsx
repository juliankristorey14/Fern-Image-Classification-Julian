import { Menu } from 'lucide-react';
import Link from 'next/link';

interface TopNavProps {
  username: string;
  profilePicture?: string;
  onMenuClick: () => void;
}

export default function TopNav({ username, profilePicture, onMenuClick }: TopNavProps) {
  return (
    <div className="bg-white border-b border-[var(--color-neutral-200)] px-4 py-4 md:px-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[var(--color-neutral-700)] hover:text-[var(--color-neutral-900)]"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 lg:flex-none"></div>

        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors cursor-pointer">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden sm:block text-[var(--color-neutral-700)]">
              {username}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
