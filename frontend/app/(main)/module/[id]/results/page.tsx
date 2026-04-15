'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { CheckCircle2, XCircle, Trophy, RotateCcw, LayoutDashboard, Star } from 'lucide-react';

interface FeedbackItem {
  question_id: number;
  question: string;
  selected: string;
  correct_answer: string;
  is_correct: boolean;
  options: string[];
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  points: number;
  message: string;
  feedback: FeedbackItem[];
}

export default function ResultsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`quiz_result_${id}`);
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.push(`/module/${id}/quiz`);
    }
  }, [id, router]);

  if (!result) return null;

  const { score, total, percentage, points, feedback } = result;
  const grade =
    percentage >= 90 ? { label: 'Excellent!', emoji: '🏆', color: '#22c55e' } :
    percentage >= 70 ? { label: 'Great Job!', emoji: '🎯', color: 'var(--color-primary)' } :
    percentage >= 50 ? { label: 'Good Effort', emoji: '💪', color: 'var(--color-warning)' } :
    { label: 'Keep Practicing', emoji: '📚', color: 'var(--color-error)' };

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Score Hero */}
        <Card hover={false} style={{ textAlign: 'center', padding: '40px 32px', marginBottom: 24, background: 'var(--gradient-surface)', position: 'relative', overflow: 'hidden' }}>
          {/* Background glow */}
          <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, background: `radial-gradient(circle, ${grade.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />

          <div style={{ fontSize: 64, marginBottom: 12 }}>{grade.emoji}</div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 900, color: grade.color, marginBottom: 6 }}>
            {grade.label}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16, marginBottom: 24 }}>
            You scored <strong style={{ color: 'var(--color-text)' }}>{score}</strong> out of <strong style={{ color: 'var(--color-text)' }}>{total}</strong> questions
          </p>

          {/* Big score ring */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: `conic-gradient(${grade.color} ${percentage}%, var(--color-surface-3) ${percentage}%)`,
            margin: '0 auto 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column',
            }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: grade.color, fontFamily: 'Space Grotesk' }}>{percentage}%</span>
            </div>
          </div>

          {/* Points earned */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Star size={18} color="var(--color-primary)" />
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>+{points} points earned!</span>
          </div>

          <div style={{ marginTop: 24 }}>
            <ProgressBar value={percentage} showPercent={false} height={8} />
          </div>
        </Card>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { icon: <CheckCircle2 size={20} />, label: 'Correct', value: score, color: '#22c55e' },
            { icon: <XCircle size={20} />, label: 'Wrong', value: total - score, color: '#ef4444' },
            { icon: <Trophy size={20} />, label: 'Points', value: `+${points}`, color: 'var(--color-primary)' },
          ].map(({ icon, label, value, color }) => (
            <Card key={label} hover={false} padding="sm">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ color }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'Space Grotesk' }}>{value}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>{label}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Per-question breakdown */}
        <Card hover={false} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>
            Question Breakdown
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {feedback.map((item, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 12,
                background: item.is_correct ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                border: `1.5px solid ${item.is_correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                  {item.is_correct
                    ? <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                    : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  }
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.5 }}>
                    {i + 1}. {item.question}
                  </p>
                </div>
                <div style={{ paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    Your answer:{' '}
                    <span style={{ fontWeight: 600, color: item.is_correct ? '#22c55e' : '#ef4444' }}>
                      {item.selected}
                    </span>
                  </div>
                  {!item.is_correct && (
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                      Correct answer:{' '}
                      <span style={{ fontWeight: 600, color: '#22c55e' }}>{item.correct_answer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => router.push(`/module/${id}/quiz`)} icon={<RotateCcw size={16} />}>
            Retry Quiz
          </Button>
          <Button onClick={() => router.push('/dashboard')} icon={<LayoutDashboard size={16} />} style={{ flex: 1 }}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
