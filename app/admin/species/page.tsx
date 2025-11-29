'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SpeciesManagement from '@/L-pages/admin/SpeciesManagement';

export default function AdminSpeciesPage() {
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

  return <SpeciesManagement onLogout={handleLogout} />;
}
