'use client';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ScoreBoard from '@/components/minigames/ScoreBoard';

type Category = 'Spam' | 'Not Spam';

interface Item {
  id: number;
  text: string;
  actual: Category;
}

const ALL_ITEMS: Item[] = [
  { id: 1, text: 'You won a free iPhone! Click here', actual: 'Spam' },
  { id: 2, text: 'Meeting moved to 3 PM tomorrow.', actual: 'Not Spam' },
  { id: 3, text: 'URGENT: Your bank account is locked', actual: 'Spam' },
  { id: 4, text: 'Hey, are we still getting dinner?', actual: 'Not Spam' },
  { id: 5, text: 'Earn $500/day working from home!!!', actual: 'Spam' },
  { id: 6, text: 'Project files attached. - Sarah', actual: 'Not Spam' },
];

export default function ClassificationGame() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ status: 'correct' | 'wrong', msg: string } | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Initialize and shuffle
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffled = [...ALL_ITEMS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setIsDone(false);
    setFeedback(null);
  };

  const currentItem = items[currentIndex];

  const handleClassify = (predicted: Category) => {
    if (!currentItem || isDone) return;

    const isCorrect = predicted === currentItem.actual;
    
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({ status: 'correct', msg: `Correct! '${currentItem.text}' is ${currentItem.actual}` });
    } else {
      setFeedback({ status: 'wrong', msg: `Oops! It was actually '${currentItem.actual}'` });
    }

    // Delay before next
    setTimeout(() => {
      if (currentIndex + 1 < items.length) {
        setCurrentIndex(c => c + 1);
        setFeedback(null);
      } else {
        setIsDone(true);
        setFeedback(null);
      }
    }, 1200);
  };

  const accuracy = items.length ? Math.round((score / items.length) * 100) : 0;

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
        <button onClick={() => router.push('/minigames')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Mini Games
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 8, color: 'var(--color-text)' }}>
          Classification Game
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Train your "human neural net". Read the email subject and quickly classify it!
        </p>

        <ScoreBoard score={score} total={items.length} accuracy={isDone ? accuracy : undefined} label="Correct" />

        {isDone ? (
          <Card padding="lg" style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{accuracy >= 80 ? '🏆' : '👍'}</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 10 }}>Training Complete!</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24, fontSize: 16 }}>
              You correctly classified {score} out of {items.length} emails.
              You achieved <strong style={{ color: accuracy >= 80 ? '#22c55e' : '#f5c518' }}>{accuracy}% Accuracy</strong>.
            </p>
            <Button onClick={startNewGame} icon={<RotateCcw size={16} />} size="lg">Play Again</Button>
          </Card>
        ) : (
          <div style={{ position: 'relative' }}>
            <Card padding="lg" style={{ minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-dim)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
                Email {currentIndex + 1} of {items.length}
              </span>
              
              <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text)', textAlign: 'center', marginBottom: 32, lineHeight: 1.4 }}>
                "{currentItem?.text}"
              </h2>

              <div style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}>
                <Button 
                  onClick={() => handleClassify('Spam')} 
                  variant="secondary"
                  disabled={!!feedback}
                  style={{ flex: 1, maxWidth: 200, padding: 16, border: '2px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
                >
                  🛑 It's Spam
                </Button>
                <Button 
                  onClick={() => handleClassify('Not Spam')} 
                  variant="secondary"
                  disabled={!!feedback}
                  style={{ flex: 1, maxWidth: 200, padding: 16, border: '2px solid rgba(34, 197, 94, 0.3)', color: '#22c55e' }}
                >
                  ✅ Safe (Not Spam)
                </Button>
              </div>
            </Card>

            {/* Feedback overlay */}
            {feedback && (
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                background: feedback.status === 'correct' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                color: '#fff', padding: '16px 24px', borderRadius: 12, fontWeight: 700,
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10,
                animation: 'pulse-glow 0.5s ease', backdropFilter: 'blur(8px)'
              }}>
                {feedback.msg}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
