'use client';
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NeuralNetworkGame() {
  const router = useRouter();
  
  // Weights for Input (x1, x2) -> Hidden (h1)
  const [w1, setW1] = useState(0.5);
  const [w2, setW2] = useState(-0.5);
  
  // Weights for Hidden (h1) -> Output (y)
  const [w3, setW3] = useState(1.0);

  // Inputs
  const input1 = 1.0;
  const input2 = 1.0;

  // Activation (Simple ReLU for visual effect)
  const relu = (x: number) => Math.max(0, x);
  
  // Forward Propagation calculation
  const hiddenValue = relu((input1 * w1) + (input2 * w2));
  const outputValue = relu(hiddenValue * w3);

  // Math visual styles
  const colorForVal = (val: number) => {
    if (val > 0) return '#22c55e'; // Green for pos
    if (val < 0) return '#ef4444'; // Red for neg
    return 'var(--color-border)'; // Grey for zero
  };

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
        <button onClick={() => router.push('/minigames')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Mini Games
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 8, color: 'var(--color-text)' }}>
          Neural Network Basics
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Adjust the weights (sliders) to see how the mathematical signal changes the final network output. 
          We are using a ReLU activation where values below 0 become 0!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: 24 }}>
          
          {/* Canvas visualization */}
          <Card padding="none" style={{ background: 'var(--color-surface-2)', minHeight: 400, position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="400">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-text-dim)" />
                </marker>
              </defs>
              
              {/* Lines */}
              <line x1="120" y1="100" x2="300" y2="200" stroke={colorForVal(w1)} strokeWidth={Math.abs(w1) * 4 + 1} opacity="0.6" markerEnd="url(#arrow)" />
              <line x1="120" y1="300" x2="300" y2="200" stroke={colorForVal(w2)} strokeWidth={Math.abs(w2) * 4 + 1} opacity="0.6" markerEnd="url(#arrow)" />
              <line x1="340" y1="200" x2="520" y2="200" stroke={colorForVal(w3)} strokeWidth={Math.abs(w3) * 4 + 1} opacity="0.6" markerEnd="url(#arrow)" />

              {/* Input Nodes */}
              <circle cx="100" cy="100" r="30" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
              <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">In: 1.0</text>
              
              <circle cx="100" cy="300" r="30" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="3" />
              <text x="100" y="305" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">In: 1.0</text>

              {/* Hidden Node */}
              <circle cx="320" cy="200" r="35" fill="var(--color-surface-3)" stroke={hiddenValue > 0 ? '#f5c518' : 'var(--color-border)'} strokeWidth="3" style={{ transition: 'stroke 0.3s' }} />
              <text x="320" y="195" textAnchor="middle" fill="var(--color-text-muted)" fontSize="10">Hidden</text>
              <text x="320" y="210" textAnchor="middle" fill={hiddenValue > 0 ? '#f5c518' : 'var(--color-text-dim)'} fontSize="16" fontWeight="bold" style={{ transition: 'all 0.3s' }}>
                {hiddenValue.toFixed(2)}
              </text>

              {/* Output Node */}
              <circle cx="540" cy="200" r="40" fill={outputValue > 0 ? 'rgba(34, 197, 94, 0.15)' : 'var(--color-surface)'} stroke={outputValue > 0 ? '#22c55e' : 'var(--color-border)'} strokeWidth="4" style={{ transition: 'all 0.3s' }} />
              <text x="540" y="195" textAnchor="middle" fill="var(--color-text-muted)" fontSize="12">Output</text>
              <text x="540" y="215" textAnchor="middle" fill={outputValue > 0 ? '#22c55e' : '#fff'} fontSize="20" fontWeight="bold" style={{ transition: 'all 0.3s' }}>
                {outputValue.toFixed(2)}
              </text>

            </svg>
          </Card>

          {/* Controls Panel */}
          <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: 10 }}>
              Adjust Weights
            </h3>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Weight 1 (Top Input)</span>
                <span style={{ fontSize: 13, fontWeight: 'bold', color: colorForVal(w1) }}>{w1.toFixed(1)}</span>
              </div>
              <input type="range" min="-2" max="2" step="0.1" value={w1} onChange={(e) => setW1(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Weight 2 (Btm Input)</span>
                <span style={{ fontSize: 13, fontWeight: 'bold', color: colorForVal(w2) }}>{w2.toFixed(1)}</span>
              </div>
              <input type="range" min="-2" max="2" step="0.1" value={w2} onChange={(e) => setW2(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
            </div>

            <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-dim)', marginBottom: 8 }}>Hidden Math:</div>
              <code style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                max(0, (1.0 * {w1.toFixed(1)}) + (1.0 * {w2.toFixed(1)}))
              </code>
            </div>

            <hr style={{ borderColor: 'var(--color-border)', margin: '4px 0' }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Weight 3 (To Output)</span>
                <span style={{ fontSize: 13, fontWeight: 'bold', color: colorForVal(w3) }}>{w3.toFixed(1)}</span>
              </div>
              <input type="range" min="-2" max="2" step="0.1" value={w3} onChange={(e) => setW3(parseFloat(e.target.value))} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
            </div>
            
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
