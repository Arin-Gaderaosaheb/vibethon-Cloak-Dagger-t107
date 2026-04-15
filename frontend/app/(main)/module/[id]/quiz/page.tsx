'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { quizAPI } from '@/lib/api';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Keyboard } from 'lucide-react';
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
  const [justAnswered, setJustAnswered] = useState(false);

  useEffect(() => {
    quizAPI.getQuestions(id as string)
      .then((res) => setQuestions(res.data.questions || []))
      .catch(() => toast.error('Failed to load questions'))
      .finally(() => setLoading(false));
  }, [id]);

  const q = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ + 1) / questions.length) * 100 : 0;
  const allAnswered = questions.length > 0 && questions.every((q) => selected[q.id] !== undefined);
  const isLocked = q ? selected[q.id] !== undefined : false;

  const handleSelect = useCallback((option: string) => {
    if (!q || isLocked) return;
    setSelected((prev) => ({ ...prev, [q.id]: option }));
    setJustAnswered(true);
    setTimeout(() => setJustAnswered(false), 300);
  }, [q, isLocked]);

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) setCurrentQ((c) => c + 1);
  }, [currentQ, questions.length]);

  // Keyboard navigation: 1-4 to select options, Enter/ArrowRight to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['1','2','3','4'].includes(e.key) && q) {
        const idx = parseInt(e.key) - 1;
        if (idx < q.options.length) handleSelect(q.options[idx]);
      }
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && isLocked && currentQ < questions.length - 1) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [q, isLocked, currentQ, questions.length, handleSelect, handleNext]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const answers = Object.entries(selected).map(([qid, ans]) => ({
        question_id: parseInt(qid),
        selected_answer: ans,
      }));
      const res = await quizAPI.submitQuiz(id as string, answers);
      sessionStorage.setItem(`quiz_result_${id}`, JSON.stringify(res.data));
      toast.success(`Quiz submitted! Score: ${res.data.score}/${res.data.total} 🎯`);
      router.push(`/module/${id}/results`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'grid', gap: 16 }}>
        {[1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)}
      </div>
    </MainLayout>
  );

  if (questions.length === 0) return (
    <MainLayout>
      <div style={{ textAlign: 'center', padding: 64 }}>
        <HelpCircle size={48} color="var(--color-text-dim)" style={{ margin: '0 auto 16px', display: 'block' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>No questions found for this module.</p>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text)' }}>
              Module Quiz
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Keyboard hint */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <Keyboard size={12} color="var(--color-text-dim)" />
                <span style={{ fontSize: 11, color: 'var(--color-text-dim)' }}>Press 1–4 to select</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {currentQ + 1} / {questions.length}
              </span>
            </div>
          </div>
          <ProgressBar value={progress} showPercent={false} height={6} />
        </div>

        {/* Question Card */}
        <Card key={currentQ} style={{ marginBottom: 16, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 900, color: '#0d0f14',
            }}>
              {currentQ + 1}
            </div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.65, paddingTop: 6 }}>
              {q.question}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected[q.id] === opt;
              const letter = String.fromCharCode(65 + i);
              return (
                <button
                  key={i}
                  id={`quiz-option-${i}`}
                  onClick={() => handleSelect(opt)}
                  disabled={isLocked}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px',
                    borderRadius: 12,
                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: isSelected ? 'rgba(245,197,24,0.12)' : 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                    cursor: isLocked ? 'default' : 'pointer',
                    fontSize: 14, fontWeight: isSelected ? 600 : 400,
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all 0.18s ease',
                    transform: isSelected && justAnswered ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 0 1px rgba(245,197,24,0.2), 0 4px 12px rgba(245,197,24,0.1)' : 'none',
                  }}
                >
                  {/* Letter badge */}
                  <span style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    border: '2px solid', borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                    background: isSelected ? 'var(--color-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                    color: isSelected ? '#0d0f14' : 'var(--color-text-dim)',
                    transition: 'all 0.18s ease',
                  }}>
                    {letter}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {isSelected && <CheckCircle2 size={16} color="var(--color-primary)" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {questions.map((q2, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                style={{
                  width: i === currentQ ? 20 : 10,
                  height: 10, borderRadius: 5,
                  background: selected[q2.id] !== undefined
                    ? 'var(--color-primary)'
                    : i === currentQ ? 'var(--color-surface-3)' : 'var(--color-surface-3)',
                  border: i === currentQ ? '2px solid var(--color-primary)' : '2px solid transparent',
                  cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          {/* Action button */}
          {currentQ < questions.length - 1 ? (
            <Button onClick={handleNext} disabled={!isLocked}>
              Next →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!allAnswered}
              icon={<CheckCircle2 size={16} />}
              style={{ minWidth: 140 }}
            >
              Submit Quiz
            </Button>
          )}
        </div>

        {/* Answered count */}
        <p style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--color-text-dim)' }}>
          {Object.keys(selected).length} of {questions.length} answered
          {isLocked && currentQ < questions.length - 1 && (
            <span style={{ marginLeft: 8, color: 'var(--color-primary)' }}>· Press Enter or → to continue</span>
          )}
        </p>
      </div>
    </MainLayout>
  );
}
