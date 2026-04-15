'use client';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 24 }}>
      <div style={{ fontSize: 80 }}>🤖</div>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 48, fontWeight: 900, color: 'var(--color-text)' }}>404</h1>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>Even ML models can't predict this page...</p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="secondary" onClick={() => router.back()} icon={<ArrowLeft size={16} />}>Go Back</Button>
        <Button onClick={() => router.push('/dashboard')} icon={<Home size={16} />}>Dashboard</Button>
      </div>
    </div>
  );
}
