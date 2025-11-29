'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSettings from '@/L-pages/admin/AdminSettings';

export default function AdminSettingsPage() {
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

  return <AdminSettings onLogout={handleLogout} />;
}
