'use client';
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ScoreBoard from '@/components/minigames/ScoreBoard';

// ─── GAME TREE DATA ──────────────────────────────────────────
type NodeId = 'root' | 'q1_yes' | 'q1_no' | 'leaf_approve' | 'leaf_reject';

interface TreeNode {
  id: NodeId;
  question?: string;
  isLeaf?: boolean;
  result?: string;
  yes?: NodeId;
  no?: NodeId;
}

const TREE: Record<NodeId, TreeNode> = {
  root: { id: 'root', question: 'Is applicant income > $50k?', yes: 'q1_yes', no: 'q1_no' },
  q1_yes: { id: 'q1_yes', isLeaf: true, result: 'Approve' },
  q1_no: { id: 'q1_no', question: 'Is credit score > 700?', yes: 'leaf_approve', no: 'leaf_reject' },
  leaf_approve: { id: 'leaf_approve', isLeaf: true, result: 'Approve' },
  leaf_reject: { id: 'leaf_reject', isLeaf: true, result: 'Reject' },
};

export default function DecisionTreeGame() {
  const router = useRouter();
  const [currentNodeId, setCurrentNodeId] = useState<NodeId>('root');
  const [history, setHistory] = useState<NodeId[]>(['root']);
  const [score, setScore] = useState(0); // Score bumps when reaching leaf

  const handleChoice = (answer: 'yes' | 'no') => {
    const node = TREE[currentNodeId];
    if (!node || node.isLeaf) return;

    const nextId = answer === 'yes' ? node.yes : node.no;
    if (nextId) {
      setCurrentNodeId(nextId);
      setHistory(prev => [...prev, nextId]);
      
      if (TREE[nextId].isLeaf) {
        setScore(s => s + 10); // Reward for completing a tree traversal
      }
    }
  };

  const reset = () => {
    setCurrentNodeId('root');
    setHistory(['root']);
  };

  const activeNode = TREE[currentNodeId];

  // SVG Helper mapping (hardcoded coordinates for this specific simple tree)
  const renderTreeSVG = () => {
    // node pos: root (200, 40), q1_yes (100, 140), q1_no (300, 140), leaf_w (220, 240), leaf_r (380, 240)
    const coords: Record<NodeId, [number, number]> = {
      root: [200, 40],
      q1_yes: [80, 140],
      q1_no: [320, 140],
      leaf_approve: [240, 240],
      leaf_reject: [400, 240]
    };

    const lines = [
      { from: 'root', to: 'q1_yes', label: 'Yes' },
      { from: 'root', to: 'q1_no', label: 'No' },
      { from: 'q1_no', to: 'leaf_approve', label: 'Yes' },
      { from: 'q1_no', to: 'leaf_reject', label: 'No' }
    ] as const;

    return (
      <svg width="480" height="300" style={{ overflow: 'visible', margin: '0 auto', display: 'block' }}>
        {/* Draw lines */}
        {lines.map((l, i) => {
          const isActive = history.includes(l.from) && history.includes(l.to);
          return (
            <g key={i}>
              <line 
                x1={coords[l.from][0]} y1={coords[l.from][1]} 
                x2={coords[l.to][0]} y2={coords[l.to][1]}
                stroke={isActive ? 'var(--color-primary)' : 'var(--color-border)'} 
                strokeWidth={isActive ? 4 : 2}
                style={{ transition: 'all 0.5s ease' }}
              />
            </g>
          );
        })}

        {/* Draw Nodes */}
        {Object.values(TREE).map((n) => {
          const isActive = history.includes(n.id);
          const isCurrent = currentNodeId === n.id;
          const [cx, cy] = coords[n.id];
          const isLeaf = n.isLeaf;

          return (
            <g key={n.id} style={{ transition: 'all 0.5s ease', transformOrigin: `${cx}px ${cy}px`, transform: isCurrent ? 'scale(1.1)' : 'scale(1)' }}>
              <rect 
                x={cx - 50} y={cy - 20} width={100} height={40} rx={8}
                fill={isActive ? 'var(--color-surface-2)' : 'var(--color-bg)'}
                stroke={isCurrent ? 'var(--color-primary)' : isActive ? 'var(--color-text-muted)' : 'var(--color-border)'}
                strokeWidth={isCurrent ? 3 : 2}
              />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill={isActive ? 'var(--color-text)' : 'var(--color-text-dim)'}>
                {isLeaf ? n.result : 'Split'}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
        <button onClick={() => router.push('/minigames')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Mini Games
        </button>

        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 8, color: 'var(--color-text)' }}>
          Decision Tree Game
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Trace your way down the tree by answering the node splits!
        </p>

        <ScoreBoard score={score} label="Points" />

        <Card style={{ marginBottom: 24, background: 'var(--color-bg)', overflowX: 'auto' }}>
          {renderTreeSVG()}
        </Card>

        {/* Controls */}
        <Card padding="lg" style={{ textAlign: 'center' }}>
          {activeNode.isLeaf ? (
            <div className="animate-fade-in">
              <div style={{ fontSize: 40, marginBottom: 12 }}>{activeNode.result === 'Approve' ? '✅' : '❌'}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                Final Result: {activeNode.result}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>
                You reached a leaf node. The decision boundary is drawn here!
              </p>
              <Button onClick={reset} icon={<RotateCcw size={16} />}>Play Again</Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text)', marginBottom: 24 }}>
                {activeNode.question}
              </h2>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <Button variant="secondary" onClick={() => handleChoice('yes')} style={{ minWidth: 120, borderColor: '#22c55e', color: '#22c55e' }}>YES</Button>
                <Button variant="secondary" onClick={() => handleChoice('no')} style={{ minWidth: 120, borderColor: '#ef4444', color: '#ef4444' }}>NO</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
