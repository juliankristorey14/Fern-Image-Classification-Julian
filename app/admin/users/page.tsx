'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserManagement from '@/L-pages/admin/UserManagement';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.replace('/admin/login');
  };

  return <UserManagement onLogout={handleLogout} />;
}
