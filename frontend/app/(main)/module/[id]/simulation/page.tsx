'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { modulesAPI } from '@/lib/api';
import { ArrowLeft, ArrowRight, RotateCcw, ChevronRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

/* ══════════════ Decision Tree Simulation ══════════════ */
const DT_STEPS = [
  {
    title: 'Step 1: Start with All Data',
    text: 'We have a dataset of loan applicants. The root node contains all records. Our goal: decide who gets approved.',
    visual: 'root',
  },
  {
    title: 'Step 2: Choose Best Feature to Split On',
    text: 'We measure Information Gain for each feature. "Income > $50k" gives the highest gain — so we split there first.',
    visual: 'split1',
  },
  {
    title: 'Step 3: Create Child Nodes',
    text: 'The data is now split into two groups: High Income (left branch) and Low Income (right branch).',
    visual: 'split2',
  },
  {
    title: 'Step 4: Recurse on Each Child',
    text: 'For Low Income applicants, we now check Credit Score. This creates two more leaf nodes.',
    visual: 'split3',
  },
  {
    title: 'Step 5: Reach Leaf Nodes',
    text: 'Each leaf node holds a final decision: Approve ✓ or Reject ✗. The tree is now trained!',
    visual: 'leaves',
  },
];

/* ══════════════ Linear Regression Simulation ══════════════ */
const LR_STEPS = [
  {
    title: 'Step 1: Collect Data Points',
    text: 'We have house size (sq ft) vs price data. Each dot on the chart is one house.',
    visual: 'scatter',
  },
  {
    title: 'Step 2: Initialize Random Line',
    text: 'We start with a random line Y = mX + b. It doesn\'t fit the data well — MSE is high.',
    visual: 'random_line',
  },
  {
    title: 'Step 3: Calculate Residuals',
    text: 'For each data point, we measure the error (residual): actual price minus predicted price.',
    visual: 'residuals',
  },
  {
    title: 'Step 4: Apply Gradient Descent',
    text: 'We nudge m (slope) and b (intercept) in the direction that reduces MSE most.',
    visual: 'gradient',
  },
  {
    title: 'Step 5: Converge to Best-Fit Line',
    text: 'After many iterations, the line fits the data well. MSE is minimized. Model is ready!',
    visual: 'fitted',
  },
];

function DecisionTreeViz({ step }: { step: number }) {
  const nodeStyle = (active: boolean, color = '#f5c518') => ({
    padding: '10px 16px',
    borderRadius: 10,
    background: active ? `${color}22` : 'var(--color-surface-3)',
    border: `2px solid ${active ? color : 'var(--color-border)'}`,
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    color: active ? color : 'var(--color-text-muted)',
    textAlign: 'center' as const,
    transition: 'all 0.4s ease',
  });

  const lineStyle = { width: 2, background: 'var(--color-border)', margin: '0 auto' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '20px 0', minHeight: 280 }}>
      {/* Root */}
      <div style={nodeStyle(step >= 0, '#f5c518')}>📦 All Applicants (100)</div>

      {step >= 1 && (
        <>
          <div style={{ ...lineStyle, height: 24 }} />
          <div style={nodeStyle(step >= 1, '#f5c518')}>💰 Income {'>'} $50k?</div>
        </>
      )}

      {step >= 2 && (
        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start', marginTop: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div style={{ ...lineStyle, height: 24 }} />
            <div style={nodeStyle(true, '#22c55e')}>✅ Yes (60)</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div style={{ ...lineStyle, height: 24 }} />
            <div style={nodeStyle(step >= 3, '#3b82f6')}>❌ No (40)</div>
          </div>
        </div>
      )}

      {step >= 3 && (
        <div style={{ display: 'flex', gap: 16, marginTop: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...lineStyle, height: 20 }} />
            <div style={nodeStyle(true, '#22c55e')}>🏦 Credit {'>'} 700?</div>
          </div>
        </div>
      )}

      {step >= 4 && (
        <div style={{ display: 'flex', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...lineStyle, height: 20 }} />
            <div style={{ ...nodeStyle(true, '#22c55e'), fontSize: 14, fontWeight: 800 }}>✅ APPROVE</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ ...lineStyle, height: 20 }} />
            <div style={{ ...nodeStyle(true, '#ef4444'), fontSize: 14, fontWeight: 800 }}>❌ REJECT</div>
          </div>
        </div>
      )}
    </div>
  );
}

function LinearRegressionViz({ step }: { step: number }) {
  // SVG-based scatter + line chart
  const points = [
    [60, 180], [80, 220], [100, 250], [120, 300], [140, 340],
    [160, 390], [180, 420], [200, 470], [220, 510], [240, 550],
  ];
  const W = 420, H = 220;
  const pad = 40;

  const toSvgX = (x: number) => pad + ((x - 50) / 200) * (W - pad * 2);
  const toSvgY = (y: number) => H - pad - ((y - 150) / 430) * (H - pad * 2);

  // Lines at different steps
  const randomLine = { m: 0.8, b: 100 }; // bad fit
  const fittedLine = { m: 1.95, b: 55 };  // good fit
  const line = step <= 1 ? randomLine : step === 4 ? fittedLine : { m: 1.4, b: 80 };

  const x1 = 60, x2 = 240;
  const ly1 = line.m * x1 + line.b;
  const ly2 = line.m * x2 + line.b;

  return (
    <div style={{ padding: '10px 0' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t}
            x1={pad} y1={pad + (H - pad * 2) * t}
            x2={W - pad} y2={pad + (H - pad * 2) * t}
            stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4,4"
          />
        ))}
        {/* Axes */}
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="var(--color-border)" strokeWidth={1.5} />
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="var(--color-border)" strokeWidth={1.5} />
        {/* Labels */}
        <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="var(--color-text-dim)">House Size (sq ft × 10)</text>
        <text x={10} y={H / 2} textAnchor="middle" fontSize={11} fill="var(--color-text-dim)" transform={`rotate(-90, 10, ${H / 2})`}>Price ($k)</text>

        {/* Residuals */}
        {step === 2 && points.map(([x, y], i) => {
          const pred = line.m * x + line.b;
          return (
            <line key={i}
              x1={toSvgX(x)} y1={toSvgY(y)}
              x2={toSvgX(x)} y2={toSvgY(pred)}
              stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3,2"
            />
          );
        })}

        {/* Regression line */}
        {step >= 1 && (
          <line
            x1={toSvgX(x1)} y1={toSvgY(ly1)} x2={toSvgX(x2)} y2={toSvgY(ly2)}
            stroke={step === 4 ? '#22c55e' : '#f5c518'}
            strokeWidth={2.5} strokeLinecap="round"
          />
        )}

        {/* Points */}
        {points.map(([x, y], i) => (
          <circle key={i} cx={toSvgX(x)} cy={toSvgY(y)} r={5}
            fill={step === 4 ? '#22c55e' : 'var(--color-primary)'}
            opacity={0.85}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8 }}>
        <div style={{ fontSize: 12, color: 'var(--color-text-dim)', textAlign: 'center' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>m = {line.m.toFixed(2)}</span>
          <br />slope
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-dim)', textAlign: 'center' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>b = {line.b}</span>
          <br />intercept
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-dim)', textAlign: 'center' }}>
          <span style={{ fontWeight: 700, color: step === 4 ? '#22c55e' : '#ef4444' }}>
            MSE = {step === 4 ? '142' : step <= 1 ? '8420' : '3200'}
          </span>
          <br />loss
        </div>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [moduleTitle, setModuleTitle] = useState('');
  const [simulationType, setSimulationType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    modulesAPI.getById(id as string)
      .then((res) => {
        const mod = res.data.module;
        setModuleTitle(mod.title);
        setSimulationType(mod.content?.simulationType || '');
      })
      .catch(() => toast.error('Failed to load simulation'))
      .finally(() => setLoading(false));
  }, [id]);

  const steps = simulationType === 'decision_tree' ? DT_STEPS : LR_STEPS;

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setCompleted(true);
  };

  const reset = () => { setCurrentStep(0); setCompleted(false); };

  if (loading) return (
    <MainLayout>
      <div className="skeleton" style={{ height: 400, borderRadius: 20 }} />
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}
        >
          <ArrowLeft size={16} /> Back to Module
        </button>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text)', marginBottom: 6 }}>
            Interactive Simulation
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{moduleTitle}</p>
        </div>

        {/* Step Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= currentStep ? 'var(--color-primary)' : 'var(--color-surface-3)',
              transition: 'background 0.3s ease',
            }} />
          ))}
        </div>

        {completed ? (
          <Card style={{ textAlign: 'center', padding: '48px 32px' } as React.CSSProperties}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text)', marginBottom: 8 }}>
              Simulation Complete!
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>
              You&apos;ve walked through all the steps. Now test your understanding with the quiz!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="secondary" onClick={reset} icon={<RotateCcw size={16} />}>Restart</Button>
              <Button onClick={() => router.push(`/module/${id}/quiz`)} icon={<ChevronRight size={16} />}>
                Take Quiz
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Visual */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              {simulationType === 'decision_tree'
                ? <DecisionTreeViz step={currentStep} />
                : <LinearRegressionViz step={currentStep} />
              }
            </Card>

            {/* Step Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>
                  {steps[currentStep].title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                  {steps[currentStep].text}
                </p>
              </Card>

              {/* Steps list */}
              <Card hover={false} padding="sm">
                {steps.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'center', padding: '8px 8px',
                    borderRadius: 8,
                    background: i === currentStep ? 'rgba(245,197,24,0.08)' : 'transparent',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: i < currentStep ? 'var(--color-success)' : i === currentStep ? 'var(--color-primary)' : 'var(--color-surface-3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700,
                      color: i <= currentStep ? '#0d0f14' : 'var(--color-text-dim)',
                    }}>
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span style={{ fontSize: 12, color: i === currentStep ? 'var(--color-text)' : 'var(--color-text-dim)', fontWeight: i === currentStep ? 600 : 400 }}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </Card>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button variant="secondary" onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0} icon={<ArrowLeft size={16} />}>
                  Prev
                </Button>
                <Button onClick={next} style={{ flex: 1 }} icon={currentStep === steps.length - 1 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}>
                  {currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
