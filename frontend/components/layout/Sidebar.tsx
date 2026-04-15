'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard, BookOpen, Trophy, LogOut, Brain, User, Zap, Gamepad2, Code2
} from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/modules', icon: BookOpen, label: 'Modules' },
  { href: '/minigames', icon: Gamepad2, label: 'Mini Games' },
  { href: '/playground', icon: Code2, label: 'Playground' },
  { href: '/scores', icon: Trophy, label: 'My Scores' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--gradient-primary)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={20} color="#0d0f14" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--color-text)', lineHeight: 1.1 }}>
              AIML
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-dim)', letterSpacing: '0.05em' }}>
              LEARNING
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <div style={{ marginBottom: 8, padding: '0 8px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Menu
          </span>
        </div>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                borderRadius: 10, marginBottom: 4,
                textDecoration: 'none',
                background: active ? 'rgba(245,197,24,0.1)' : 'transparent',
                color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.2s ease',
                borderLeft: active ? '3px solid var(--color-primary)' : '3px solid transparent',
              }}
            >
              <Icon size={18} />
              {label}
              {active && (
                <Zap size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User panel */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px', borderRadius: 12,
          background: 'var(--color-surface-2)',
          marginBottom: 8,
        }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--gradient-primary)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <User size={16} color="#0d0f14" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'Guest'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '9px 12px',
            borderRadius: 10, border: 'none',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--color-error)', fontSize: 14, fontWeight: 500,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
