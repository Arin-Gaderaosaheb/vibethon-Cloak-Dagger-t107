'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: '32px', maxWidth: 'calc(100vw - 240px)' }}>
        {children}
      </main>
    </div>
  );
}
