'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { quizAPI } from '@/lib/api';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    quizAPI.getQuestions(id as string)
      .then((res) => setQuestions(res.data.questions || []))
      .catch(() => toast.error('Failed to load questions'))
      .finally(() => setLoading(false));
  }, [id]);

  const q = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const allAnswered = questions.every((q) => selected[q.id] !== undefined);

  const handleSelect = (option: string) => {
    if (selected[q.id] !== undefined) return; // locked after selection
    setSelected((prev) => ({ ...prev, [q.id]: option }));
    setAnswered(true);
  };

  const handleNext = () => {
    setAnswered(false);
    setCurrentQ((c) => c + 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const answers = Object.entries(selected).map(([qid, ans]) => ({
        question_id: parseInt(qid),
        selected_answer: ans,
      }));
      const res = await quizAPI.submitQuiz(id as string, answers);
      const result = res.data;
      // Store result in sessionStorage for results page
      sessionStorage.setItem(`quiz_result_${id}`, JSON.stringify(result));
      toast.success(`Quiz submitted! Score: ${result.score}/${result.total}`);
      router.push(`/module/${id}/results`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div style={{ display: 'grid', gap: 16 }}>
        {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
      </div>
    </MainLayout>
  );

  if (questions.length === 0) return (
    <MainLayout>
      <div style={{ textAlign: 'center', padding: 64 }}>
        <HelpCircle size={48} color="var(--color-text-dim)" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>No questions found for this module.</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 680, margin: '0 auto' }}>
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text)' }}>
              Module Quiz
            </h1>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {currentQ + 1} / {questions.length}
            </span>
          </div>
          <ProgressBar value={progress} showPercent={false} height={6} />
        </div>

        {/* Question */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: '#0d0f14',
            }}>
              {currentQ + 1}
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.6, paddingTop: 4 }}>
              {q.question}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected[q.id] === opt;
              const isLocked = selected[q.id] !== undefined;
              return (
                <button
                  key={i}
                  id={`option-${i}`}
                  onClick={() => handleSelect(opt)}
                  disabled={isLocked}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px',
                    borderRadius: 12, border: '1.5px solid',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    background: isSelected ? 'rgba(245,197,24,0.1)' : 'var(--color-surface-2)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--color-text)',
                    cursor: isLocked ? 'default' : 'pointer',
                    fontSize: 14, fontWeight: isSelected ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: 12,
                    transition: 'all 0.2s ease',
                    transform: !isLocked ? 'none' : 'none',
                  }}
                  onMouseEnter={e => { if (!isLocked) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245,197,24,0.5)'; }}
                  onMouseLeave={e => { if (!isLocked && !isSelected) (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'; }}
                >
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    border: '2px solid', borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    background: isSelected ? 'var(--color-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700,
                    color: isSelected ? '#0d0f14' : 'var(--color-text-dim)',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: selected[questions[i].id] !== undefined
                  ? 'var(--color-primary)'
                  : i === currentQ ? 'var(--color-surface-3)' : 'var(--color-surface-3)',
                border: i === currentQ ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>

          {currentQ < questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!selected[q.id]}>
              Next Question →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!allAnswered}
              icon={<CheckCircle2 size={16} />}
            >
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Answered count */}
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--color-text-dim)' }}>
          {Object.keys(selected).length} of {questions.length} questions answered
        </p>
      </div>
    </MainLayout>
  );
}
