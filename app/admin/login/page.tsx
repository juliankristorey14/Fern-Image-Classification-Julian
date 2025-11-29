'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLogin from '@/L-pages/admin/AdminLogin';
import type { User } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = (user: User) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    router.push('/admin');
  };

  return <AdminLogin onLogin={handleLogin} />;
}
