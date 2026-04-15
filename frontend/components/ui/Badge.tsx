'use client';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'error' | 'warning';
  className?: string;
  style?: React.CSSProperties;
}

export default function Badge({ children, variant = 'primary', className, style }: BadgeProps) {
  const varClass = {
    primary: 'badge-primary',
    success: 'badge-success',
    error: 'badge-error',
    warning: 'bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)] border border-[rgba(245,158,11,0.3)]',
  }[variant];

  return <span className={clsx('badge', varClass, className)} style={style}>{children}</span>;
}
