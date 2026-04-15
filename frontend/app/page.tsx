import type { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Zap, HelpCircle, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AIML Learning — Master AI & ML Interactively',
  description: 'Learn Decision Trees, Linear Regression and core AI/ML concepts through hands-on simulations, instant-feedback quizzes, and gamified progress tracking.',
  keywords: 'AI, Machine Learning, Decision Trees, Linear Regression, interactive learning, quiz',
  openGraph: {
    title: 'AIML Learning — Master AI & ML Interactively',
    description: 'Hands-on simulations and quizzes to master core AI/ML concepts.',
    type: 'website',
  },
};

const features = [
  { icon: '🌳', title: 'Decision Trees', desc: 'Visualize how trees split data, learn Gini impurity, pruning, and information gain step by step.' },
  { icon: '📈', title: 'Linear Regression', desc: 'Watch gradient descent fit a line in real-time. Understand MSE, slope, and R² through interaction.' },
  { icon: '🧠', title: 'Instant Quiz Feedback', desc: '3–5 questions per module. Get immediate right/wrong feedback with explanations.' },
  { icon: '🏆', title: 'Points & Progress', desc: 'Earn points for every correct answer. Track your learning journey on the dashboard.' },
];

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up free in seconds — no credit card needed.' },
  { step: '02', title: 'Pick a Module', desc: 'Choose from Decision Trees or Linear Regression.' },
  { step: '03', title: 'Run the Simulation', desc: 'Step through an interactive visualization with explanations.' },
  { step: '04', title: 'Take the Quiz', desc: 'Test your knowledge with instant feedback and earn points.' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(13,15,20,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: 'var(--gradient-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={18} color="#0d0f14" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--color-text)' }}>AIML Learning</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: 14, color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500, padding: '8px 16px' }}>
            Sign In
          </Link>
          <Link href="/register" className="btn btn-primary btn-sm">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: 0, left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 100, right: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="animate-fade-in" style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: 'rgba(245,197,24,0.1)', border: '1px solid rgba(245,197,24,0.25)', marginBottom: 24 }}>
            <Star size={12} color="var(--color-primary)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)' }}>Interactive AI/ML Learning Platform</span>
          </div>

          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
            Learn AI & ML the{' '}
            <span className="text-gradient">Interactive Way</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--color-text-muted)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px', fontWeight: 400 }}>
            Stop reading textbooks. Master Decision Trees and Linear Regression through step-by-step simulations, instant quizzes, and gamified progress tracking.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {[
              { value: '2', label: 'AI/ML Modules' },
              { value: '10', label: 'Quiz Questions' },
              { value: '5', label: 'Sim Steps Each' },
              { value: '∞', label: 'Retry Attempts' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: 32, fontWeight: 900, color: 'var(--color-primary)' }}>{value}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-dim)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, marginBottom: 12 }}>Everything you need to get started</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>Built for beginners, loved by students</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {features.map(({ icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>{title}</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, marginBottom: 12 }}>How it works</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>Four steps from zero to quiz master</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontFamily: 'Space Grotesk', fontWeight: 900, fontSize: 16, color: '#0d0f14',
                }}>
                  {step}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ display: 'none' }} /> // spacer for grid
                )}
                <h3 style={{ fontFamily: 'Space Grotesk', fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', padding: '56px 40px',
          background: 'linear-gradient(135deg, rgba(245,197,24,0.1) 0%, rgba(59,130,246,0.06) 100%)',
          border: '1px solid rgba(245,197,24,0.2)', borderRadius: 24,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ready to build intuition for AI?</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 28 }}>
            Create your free account and start the Decision Trees module in under 60 seconds.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            Start Learning — It&apos;s Free →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>AIML Learning</span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Built with Next.js · Node.js · MySQL · ❤️</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/login" style={{ fontSize: 13, color: 'var(--color-text-dim)', textDecoration: 'none' }}>Sign In</Link>
          <Link href="/register" style={{ fontSize: 13, color: 'var(--color-text-dim)', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>
    </div>
  );
}
