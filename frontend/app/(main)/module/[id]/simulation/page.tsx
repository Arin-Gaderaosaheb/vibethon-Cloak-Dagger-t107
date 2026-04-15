'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { modulesAPI } from '@/lib/api';
import {
  ArrowLeft, ArrowRight, RotateCcw, ChevronRight,
  CheckCircle2, Play, Pause,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ══════════════════════════════════════════════════════
   DECISION TREE STEPS
════════════════════════════════════════════════════════ */
const DT_STEPS = [
  {
    title: 'All Data at the Root',
    text: 'We start with our full loan applicant dataset (100 records) at the root node. Our goal is to build a tree that predicts: Approve or Reject?',
    insight: '💡 The root node always contains 100% of your training data.',
  },
  {
    title: 'Select the Best Feature',
    text: 'We test every feature (Income, Credit Score, Employment) and pick the one with the highest Information Gain. "Income > $50k" wins — it best separates Approve vs Reject applicants.',
    insight: '💡 Higher Information Gain = less uncertainty after the split.',
  },
  {
    title: 'Split into Child Nodes',
    text: 'Data is split into two groups: High Income (60 records, mostly Approve) and Low Income (40 records, mixed). We now recurse on each child.',
    insight: '💡 Each split should increase data purity (Gini closer to 0).',
  },
  {
    title: 'Recurse on Low Income Branch',
    text: 'For Low Income applicants, we still have uncertainty. We now split on "Credit Score > 700". This creates two purer child nodes.',
    insight: '💡 We stop recursing when a node is pure or max_depth is reached.',
  },
  {
    title: 'Leaf Nodes — Final Decisions',
    text: 'All paths now end at leaf nodes. High Income → Approve. Low Income + Good Credit → Approve. Low Income + Bad Credit → Reject. Tree is trained!',
    insight: '🏆 To predict new data: just follow the branches from root to leaf.',
  },
];

/* ══════════════════════════════════════════════════════
   LINEAR REGRESSION STEPS
════════════════════════════════════════════════════════ */
const LR_STEPS = [
  {
    title: 'Collect Training Data',
    text: 'We have 10 data points: house sizes (X) and their prices (Y). Each dot on the scatter plot is one house. We want to draw the best line through them.',
    insight: '💡 More data = better generalization. For now, 10 points is enough to demonstrate.',
  },
  {
    title: 'Initialize a Random Line',
    text: 'We start with random values for slope (m = 0.8) and intercept (b = 100). This line is a terrible fit — the MSE (average squared error) is very high at 8,420.',
    insight: '💡 The initial line is just a starting point. Gradient Descent will improve it.',
  },
  {
    title: 'Measure Residuals (Errors)',
    text: 'For every data point, we compute the residual = actual Y − predicted Y. The red dashed lines show how far off our predictions are. Large residuals = high MSE.',
    insight: '💡 MSE = mean of all (residual²). We want to minimize this.',
  },
  {
    title: 'Apply Gradient Descent',
    text: 'We compute the gradient of MSE with respect to m and b, then nudge both in the direction that reduces error. After many iterations, the line moves towards the data.',
    insight: '💡 Learning rate controls step size. Too large = overshoots. Too small = slow.',
  },
  {
    title: 'Convergence — Best Fit Line',
    text: 'After running gradient descent until MSE stops improving, we have our best-fit line (m ≈ 1.95, b ≈ 55, MSE = 142). We can now predict any new house price!',
    insight: '🏆 R² = 0.97 for this fit — the model explains 97% of price variance.',
  },
];

/* ══════════════════════════════════════════════════════
   DECISION TREE VISUALIZATION
════════════════════════════════════════════════════════ */
function DecisionTreeViz({ step }: { step: number }) {
  const node = (
    label: string, active: boolean,
    color = '#f5c518', icon = '',
    wide = false
  ) => (
    <div style={{
      padding: wide ? '10px 20px' : '9px 16px',
      borderRadius: 12,
      background: active ? `${color}18` : 'var(--color-surface-3)',
      border: `2px solid ${active ? color : 'var(--color-border)'}`,
      fontSize: 13, fontWeight: active ? 700 : 400,
      color: active ? color : 'var(--color-text-muted)',
      transition: 'all 0.4s ease',
      whiteSpace: 'nowrap' as const,
      boxShadow: active ? `0 0 20px ${color}25` : 'none',
      textAlign: 'center' as const,
    }}>
      {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
      {label}
    </div>
  );

  const vline = (h = 24) => (
    <div style={{ width: 2, height: h, background: 'var(--color-border)', margin: '0 auto', transition: 'opacity 0.4s' }} />
  );

  const hline = (w = 80) => (
    <div style={{ width: w, height: 2, background: 'var(--color-border)', transition: 'opacity 0.4s' }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 300, padding: '16px 8px', gap: 0 }}>

      {/* Root */}
      {node('📦 All Applicants (100)', step >= 0, '#f5c518', '', true)}

      {step >= 1 && (<>
        {vline()}
        {node('💰 Income > $50k?', step >= 1, '#f5c518', '', true)}
      </>)}

      {step >= 2 && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginTop: 0 }}>
          {/* Left branch */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {vline()}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {hline(40)}
              {node('✅ YES (60)', true, '#22c55e')}
            </div>
            {step >= 4 && (<>
              {vline()}
              {node('✅ APPROVE', true, '#22c55e', '🎉')}
            </>)}
          </div>

          {/* Right branch */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginLeft: 20 }}>
            {vline()}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {node('❌ NO (40)', step >= 3, '#3b82f6')}
              {hline(40)}
            </div>
            {step >= 3 && (<>
              {vline()}
              {node('🏦 Credit > 700?', true, '#3b82f6')}
              <div style={{ display: 'flex', gap: 16, marginTop: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {vline()}
                  {node('✅ APPROVE', step >= 4, '#22c55e', '👍')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {vline()}
                  {node('❌ REJECT', step >= 4, '#ef4444', '👎')}
                </div>
              </div>
            </>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LINEAR REGRESSION VISUALIZATION
════════════════════════════════════════════════════════ */
function LinearRegressionViz({ step }: { step: number }) {
  const W = 400, H = 200, pad = { left: 44, right: 16, top: 16, bottom: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const dataPoints = [
    [60, 175], [75, 210], [90, 240], [105, 285],
    [120, 310], [140, 360], [160, 395], [180, 440],
    [200, 475], [225, 530],
  ];

  const xMin = 55, xMax = 235, yMin = 150, yMax = 560;
  const toX = (v: number) => pad.left + ((v - xMin) / (xMax - xMin)) * innerW;
  const toY = (v: number) => pad.top + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  // Line params per step
  const lines = [
    null,                         // step 0 — no line
    { m: 0.80, b: 85 },          // step 1 — bad fit
    { m: 0.80, b: 85 },          // step 2 — show residuals same line
    { m: 1.40, b: 65 },          // step 3 — gradient descent iteration
    { m: 1.95, b: 45 },          // step 4 — best fit
  ];
  const currentLine = step < lines.length ? lines[step] : null;
  const lineColor = step === 4 ? '#22c55e' : '#f5c518';

  const gridYs = [0.2, 0.4, 0.6, 0.8];
  const gridXs = [0.25, 0.5, 0.75];

  const mse = [null, 8420, 8420, 3150, 142][step];
  const rSq = step === 4 ? '0.97' : step === 3 ? '0.81' : step >= 1 ? '0.12' : '—';

  return (
    <div style={{ padding: '8px 0' }}>
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        {/* Grid lines */}
        {gridYs.map((t) => (
          <line key={`gy${t}`}
            x1={pad.left} y1={pad.top + innerH * t}
            x2={pad.left + innerW} y2={pad.top + innerH * t}
            stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4,4" />
        ))}
        {gridXs.map((t) => (
          <line key={`gx${t}`}
            x1={pad.left + innerW * t} y1={pad.top}
            x2={pad.left + innerW * t} y2={pad.top + innerH}
            stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4,4" />
        ))}

        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + innerH}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
        <line x1={pad.left} y1={pad.top + innerH} x2={pad.left + innerW} y2={pad.top + innerH}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />

        {/* Axis labels */}
        <text x={W / 2} y={H - 2} textAnchor="middle" fontSize={10} fill="var(--color-text-dim)">
          House Size (sq ft ÷ 10)
        </text>
        <text x={10} y={H / 2} textAnchor="middle" fontSize={10} fill="var(--color-text-dim)"
          transform={`rotate(-90,10,${H / 2})`}>
          Price ($k)
        </text>

        {/* Residual lines */}
        {step === 2 && currentLine && dataPoints.map(([x, y], i) => {
          const pred = currentLine.m * x + currentLine.b;
          return (
            <line key={i}
              x1={toX(x)} y1={toY(y)} x2={toX(x)} y2={toY(pred)}
              stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3,2" opacity={0.8} />
          );
        })}

        {/* Regression line */}
        {currentLine && (() => {
          const x1v = xMin, x2v = xMax;
          const y1v = currentLine.m * x1v + currentLine.b;
          const y2v = currentLine.m * x2v + currentLine.b;
          return (
            <line
              x1={toX(x1v)} y1={toY(y1v)} x2={toX(x2v)} y2={toY(y2v)}
              stroke={lineColor} strokeWidth={2.5} strokeLinecap="round"
              style={{ transition: 'all 0.6s ease' }}
            />
          );
        })()}

        {/* Data points */}
        {dataPoints.map(([x, y], i) => (
          <circle key={i} cx={toX(x)} cy={toY(y)} r={5}
            fill={step === 4 ? '#22c55e' : 'var(--color-primary)'}
            opacity={0.88}
            style={{ transition: 'fill 0.4s ease' }}
          />
        ))}
      </svg>

      {/* Metrics row */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
        {[
          { label: 'slope (m)', value: currentLine ? currentLine.m.toFixed(2) : '—', color: lineColor },
          { label: 'intercept (b)', value: currentLine ? currentLine.b : '—', color: lineColor },
          { label: 'MSE', value: mse !== null ? mse.toLocaleString() : '—', color: mse !== null && mse < 200 ? '#22c55e' : '#ef4444' },
          { label: 'R²', value: rSq, color: step === 4 ? '#22c55e' : 'var(--color-text-muted)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: 'Space Grotesk', transition: 'color 0.4s' }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN SIMULATION PAGE
════════════════════════════════════════════════════════ */
export default function SimulationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [moduleTitle, setModuleTitle] = useState('');
  const [simType, setSimType] = useState('');
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    modulesAPI.getById(id as string)
      .then((res) => {
        setModuleTitle(res.data.module.title);
        setSimType(res.data.module.content?.simulationType || 'decision_tree');
      })
      .catch(() => toast.error('Failed to load simulation'))
      .finally(() => setLoading(false));
  }, [id]);

  const steps = simType === 'linear_regression' ? LR_STEPS : DT_STEPS;
  const total = steps.length;

  const next = useCallback(() => {
    if (step < total - 1) setStep((s) => s + 1);
    else { setDone(true); setAutoPlay(false); }
  }, [step, total]);

  const prev = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => { setStep(0); setDone(false); setAutoPlay(false); };

  // Auto-play: advance every 2.5s
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(next, 2500);
    return () => clearTimeout(t);
  }, [autoPlay, step, next]);

  // Keyboard: ArrowRight / ArrowLeft
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next]);

  if (loading) return (
    <MainLayout>
      <div className="skeleton" style={{ height: 400, borderRadius: 20 }} />
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Back */}
        <button onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Module
        </button>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--color-text)', marginBottom: 4 }}>
              Interactive Simulation
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{moduleTitle}</p>
          </div>
          {!done && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>← → keys</span>
              <button
                onClick={() => setAutoPlay((a) => !a)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, border: '1px solid',
                  borderColor: autoPlay ? 'var(--color-primary)' : 'var(--color-border)',
                  background: autoPlay ? 'rgba(245,197,24,0.1)' : 'var(--color-surface-2)',
                  color: autoPlay ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}
              >
                {autoPlay ? <><Pause size={14} /> Auto</> : <><Play size={14} /> Auto</>}
              </button>
            </div>
          )}
        </div>

        {/* Step progress bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => { setStep(i); setDone(false); }}
              style={{
                flex: 1, height: 5, borderRadius: 3, border: 'none',
                background: i < step ? 'var(--color-primary)'
                  : i === step ? 'linear-gradient(90deg, var(--color-primary), var(--color-primary-light))'
                  : 'var(--color-surface-3)',
                cursor: 'pointer',
                transition: 'background 0.35s ease',
                opacity: i <= step ? 1 : 0.4,
              }}
            />
          ))}
        </div>

        {done ? (
          /* ── Completion Card ── */
          <Card hover={false} style={{ textAlign: 'center', padding: '56px 32px' }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: 'fadeIn 0.5s ease' }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>
              Simulation Complete!
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>
              You&apos;ve walked through all {total} steps of <strong style={{ color: 'var(--color-primary)' }}>{moduleTitle}</strong>. Now test your understanding with the quiz!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button variant="secondary" onClick={reset} icon={<RotateCcw size={16} />}>Restart</Button>
              <Button size="lg" onClick={() => router.push(`/module/${id}/quiz`)} icon={<ChevronRight size={18} />}>
                Take Quiz Now
              </Button>
            </div>
          </Card>
        ) : (
          /* ── Main Simulation Grid ── */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Visual panel */}
            <Card style={{ minHeight: 360 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Visualization
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>
                  Step {step + 1} of {total}
                </span>
              </div>
              <div style={{ transition: 'opacity 0.3s ease' }}>
                {simType === 'linear_regression'
                  ? <LinearRegressionViz step={step} />
                  : <DecisionTreeViz step={step} />}
              </div>
            </Card>

            {/* Content panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Step explanation */}
              <Card key={step} style={{ flex: 1, animation: 'fadeIn 0.35s ease' }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--color-text)', marginBottom: 12, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {steps[step].title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 16 }}>
                  {steps[step].text}
                </p>
                <div style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(245,197,24,0.06)',
                  border: '1px solid rgba(245,197,24,0.15)',
                  fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6,
                }}>
                  {steps[step].insight}
                </div>
              </Card>

              {/* Steps checklist */}
              <Card hover={false} padding="sm">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {steps.map((s, i) => (
                    <button key={i} onClick={() => setStep(i)}
                      style={{
                        display: 'flex', gap: 10, alignItems: 'center',
                        padding: '7px 10px', borderRadius: 8, border: 'none',
                        background: i === step ? 'rgba(245,197,24,0.08)' : 'transparent',
                        cursor: 'pointer', width: '100%', textAlign: 'left',
                        transition: 'background 0.2s',
                      }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                        background: i < step ? '#22c55e' : i === step ? 'var(--color-primary)' : 'var(--color-surface-3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800,
                        color: i <= step ? '#0d0f14' : 'var(--color-text-dim)',
                        transition: 'all 0.3s',
                      }}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: 12, lineHeight: 1.3, color: i === step ? 'var(--color-text)' : 'var(--color-text-dim)', fontWeight: i === step ? 600 : 400 }}>
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 10 }}>
                <Button variant="secondary" onClick={prev} disabled={step === 0} icon={<ArrowLeft size={15} />} size="sm">
                  Prev
                </Button>
                <Button onClick={next} style={{ flex: 1 }}
                  icon={step === total - 1 ? <CheckCircle2 size={15} /> : <ArrowRight size={15} />}>
                  {step === total - 1 ? 'Finish ✓' : 'Next Step'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
