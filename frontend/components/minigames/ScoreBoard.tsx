import React from 'react';
import Card from '@/components/ui/Card';
import { Target, Zap } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  total?: number;
  accuracy?: number;
  label?: string;
}

export default function ScoreBoard({ score, total, accuracy, label = "Score" }: ScoreBoardProps) {
  return (
    <Card padding="sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingLeft: 24, paddingRight: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Target size={20} color="var(--color-primary)" />
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-muted)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--color-text)' }}>
            {score} {total && <span style={{ fontSize: 16, color: 'var(--color-text-dim)' }}>/ {total}</span>}
          </div>
        </div>
        {accuracy !== undefined && (
          <>
            <div style={{ height: 32, width: 2, background: 'var(--color-border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={16} color={accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f5c518' : '#ef4444'} />
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Space Grotesk', color: accuracy >= 80 ? '#22c55e' : accuracy >= 50 ? '#f5c518' : '#ef4444' }}>
                {accuracy}%
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
