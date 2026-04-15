'use client';

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  showPercent?: boolean;
  color?: 'primary' | 'success' | 'error';
  height?: number;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  height = 6,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-[var(--color-text-muted)]">{label}</span>}
          {showPercent && (
            <span className="text-sm font-semibold text-[var(--color-primary)]">{clamped}%</span>
          )}
        </div>
      )}
      <div className="progress-bar" style={{ height }}>
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
