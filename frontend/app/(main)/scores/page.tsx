'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { userAPI } from '@/lib/api';
import { Trophy, Star, TrendingUp, Clock, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Score {
  id: number;
  module_id: number;
  module_title: string;
  score: number;
  total: number;
  percentage: number;
  points: number;
  attempted_at: string;
}

export default function ScoresPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getScores()
      .then((res) => {
        setScores(res.data.scores || []);
        setTotalPoints(res.data.totalPoints || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const best = scores.reduce((acc, s) => {
    if (!acc[s.module_id] || s.percentage > acc[s.module_id].percentage) acc[s.module_id] = s;
    return acc;
  }, {} as Record<number, Score>);

  const avgPct = scores.length
    ? Math.round(scores.reduce((a, s) => a + s.percentage, 0) / scores.length)
    : 0;

  const gradeColor = (pct: number) =>
    pct >= 80 ? 'var(--color-success)' : pct >= 60 ? 'var(--color-warning)' : 'var(--color-error)';

  const gradeLabel = (pct: number) =>
    pct === 100 ? '🏆' : pct >= 80 ? '🎯' : pct >= 60 ? '💪' : '📚';

  const formatDate = (dt: string) =>
    new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, background: 'var(--gradient-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={22} color="#0d0f14" />
            </div>
            <div>
              <h1 className="section-title" style={{ marginBottom: 0 }}>My Scores</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
                {scores.length} quiz attempt{scores.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { icon: <Star size={20} />, label: 'Total Points', value: totalPoints, color: 'var(--color-primary)' },
            { icon: <TrendingUp size={20} />, label: 'Avg Score', value: `${avgPct}%`, color: '#3b82f6' },
            { icon: <Trophy size={20} />, label: 'Attempts', value: scores.length, color: '#22c55e' },
          ].map(({ icon, label, value, color }) => (
            <Card key={label} hover={false}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ color, width: 40, height: 40, background: `${color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'Space Grotesk' }}>{loading ? '—' : value}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Best Scores per module */}
        {Object.values(best).length > 0 && (
          <Card hover={false} style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Best Score Per Module</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.values(best).map((s) => (
                <div key={s.module_id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{s.module_title}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 16 }}>{gradeLabel(s.percentage)}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: gradeColor(s.percentage) }}>{s.percentage}%</span>
                      <Badge variant="primary">+{s.points}pts</Badge>
                    </div>
                  </div>
                  <ProgressBar value={s.percentage} showPercent={false} height={6} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* All Attempts */}
        <Card hover={false}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>All Attempts</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />)}
            </div>
          ) : scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>No quiz attempts yet. Take a quiz to see your scores here!</p>
              <Button onClick={() => router.push('/modules')} icon={<TrendingUp size={16} />}>Browse Modules</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scores.map((s) => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                  borderRadius: 12, background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                }}>
                  <span style={{ fontSize: 22 }}>{gradeLabel(s.percentage)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 2 }}>{s.module_title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-dim)' }}>
                      <Clock size={11} />
                      {formatDate(s.attempted_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: gradeColor(s.percentage), fontFamily: 'Space Grotesk' }}>
                      {s.score}/{s.total}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{s.percentage}%</div>
                  </div>
                  <Badge variant="primary">+{s.points}pts</Badge>
                  <Button size="sm" variant="ghost" onClick={() => router.push(`/module/${s.module_id}/quiz`)} icon={<RotateCcw size={12} />}>
                    Retry
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
