'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { modulesAPI, userAPI } from '@/lib/api';
import {
  BookOpen, Trophy, Zap, ChevronRight, CheckCircle2,
  Clock, Star, TrendingUp, Brain,
} from 'lucide-react';
import Link from 'next/link';

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  completed?: boolean;
  last_accessed?: string;
}

interface ScoreSummary {
  totalPoints: number;
  scores: { module_title: string; percentage: number; points: number }[];
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [modules, setModules] = useState<Module[]>([]);
  const [scoreSummary, setScoreSummary] = useState<ScoreSummary>({ totalPoints: 0, scores: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, scoreRes] = await Promise.all([
          modulesAPI.getAll(),
          userAPI.getScores(),
        ]);
        setModules(modRes.data.modules || []);
        setScoreSummary({
          totalPoints: scoreRes.data.totalPoints || 0,
          scores: scoreRes.data.scores || [],
        });
      } catch {
        /* silently handled */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const completed = modules.filter((m) => m.completed).length;
  const progressPct = modules.length ? Math.round((completed / modules.length) * 100) : 0;

  const moduleIcons = ['🌳', '📈'];
  const moduleColors = ['rgba(245,197,24,0.1)', 'rgba(59,130,246,0.1)'];
  const moduleBorders = ['rgba(245,197,24,0.25)', 'rgba(59,130,246,0.25)'];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, background: 'var(--gradient-primary)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Brain size={22} color="#0d0f14" />
            </div>
            <div>
              <h1 className="section-title" style={{ marginBottom: 0 }}>
                Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}!</span>
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
                Ready to level up your AI/ML knowledge today?
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            {
              icon: <BookOpen size={20} />, label: 'Modules',
              value: `${completed}/${modules.length}`, sub: 'completed',
              color: 'var(--color-primary)',
            },
            {
              icon: <Trophy size={20} />, label: 'Total Points',
              value: scoreSummary.totalPoints, sub: 'earned',
              color: '#22c55e',
            },
            {
              icon: <TrendingUp size={20} />, label: 'Progress',
              value: `${progressPct}%`, sub: 'of curriculum',
              color: '#3b82f6',
            },
          ].map(({ icon, label, value, sub, color }) => (
            <Card key={label} hover={false} style={{ position: 'relative', overflow: 'hidden' } as React.CSSProperties}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>{label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                    {loading ? '—' : value}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--color-text-dim)', marginTop: 4 }}>{sub}</p>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                }}>
                  {icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Overall Progress Bar */}
        <Card hover={false} style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>
              Overall Learning Progress
            </h2>
            <Badge variant="primary">{progressPct}% Complete</Badge>
          </div>
          <ProgressBar value={progressPct} showPercent={false} height={10} />
          <p style={{ fontSize: 13, color: 'var(--color-text-dim)', marginTop: 10 }}>
            {completed === modules.length && modules.length > 0
              ? '🎉 All modules completed! You\'re on fire!'
              : `${modules.length - completed} module${modules.length - completed !== 1 ? 's' : ''} remaining`}
          </p>
        </Card>

        {/* Modules Grid */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
              Learning Modules
            </h2>
            <Link href="/modules" style={{ fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
              View all →
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="card"
                  style={{
                    padding: 24, cursor: 'pointer',
                    background: moduleColors[idx % moduleColors.length],
                    border: `1px solid ${moduleBorders[idx % moduleBorders.length]}`,
                    position: 'relative', overflow: 'hidden',
                  }}
                  onClick={() => router.push(`/module/${mod.id}`)}
                >
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{moduleIcons[idx % moduleIcons.length]}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>
                      {mod.title}
                    </h3>
                    {mod.completed && <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
                    {mod.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge variant={mod.completed ? 'success' : 'primary'}>
                      {mod.completed ? '✓ Completed' : 'Start Learning'}
                    </Badge>
                    <ChevronRight size={16} color="var(--color-text-dim)" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Scores */}
        {scoreSummary.scores.length > 0 && (
          <Card hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Star size={18} color="var(--color-primary)" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Recent Quiz Scores</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scoreSummary.scores.slice(0, 3).map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{s.module_title}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.percentage >= 80 ? 'var(--color-success)' : s.percentage >= 60 ? 'var(--color-warning)' : 'var(--color-error)' }}>
                        {s.percentage}%
                      </span>
                    </div>
                    <ProgressBar value={s.percentage} showPercent={false} height={4} />
                  </div>
                  <Badge variant="primary">+{s.points}pts</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
