'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScanLogs from '@/L-pages/admin/ScanLogs';

export default function AdminScansPage() {
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

  return <ScanLogs onLogout={handleLogout} />;
}
