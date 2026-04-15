'use client';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = true,
  padding = 'md',
  onClick,
}: CardProps) {
  const padClass = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding];
  return (
    <div
      className={clsx('card', padClass, !hover && '[&:hover]:transform-none [&:hover]:border-[var(--color-border)] [&:hover]:shadow-[var(--shadow-card)]', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
