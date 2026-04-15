'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeEditor from '@/components/playground/CodeEditor';
import { playgroundAPI } from '@/lib/api';
import { Play, RotateCcw, Terminal, FileCode, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ML_SCRIPTS = [
  {
    id: 'matrix-math',
    name: 'Matrix Multiplication',
    code: `# Basic Matrix Multiplication in Python
def multiply_matrices(A, B):
    result = [[0, 0], [0, 0]]
    for i in range(len(A)):
        for j in range(len(B[0])):
            for k in range(len(B)):
                result[i][j] += A[i][k] * B[k][j]
    return result

matrix_a = [[1, 2], [3, 4]]
matrix_b = [[5, 6], [7, 8]]

print("Matrix A:", matrix_a)
print("Matrix B:", matrix_b)
print("Result of A * B:", multiply_matrices(matrix_a, matrix_b))`
  },
  {
    id: 'linear-regression',
    name: 'Linear Regression Concept',
    code: `# Simple Linear Regression (y = mx + b)
def predict(x, m, b):
    return m * x + b

# Mock datasets
data_points = [1, 2, 3, 4, 5]
actual_y = [2, 4, 5, 4, 5]

# Initial parameters
m = 0.8
b = 0.5

print(f"Model: y = {m}x + {b}")
print("-" * 20)
for x in data_points:
    prediction = predict(x, m, b)
    print(f"Input: {x} | Predicted: {prediction:.2f}")`
  },
  {
    id: 'data-scaling',
    name: 'Simple Data Scaling',
    code: `# Min-Max Scaling [0, 1]
def min_max_scale(data):
    min_val = min(data)
    max_val = max(data)
    return [(x - min_val) / (max_val - min_val) for x in data]

raw_data = [10, 20, 30, 40, 50, 100]
scaled_data = min_max_scale(raw_data)

print("Raw Data:", raw_data)
print("Scaled Data:", [round(x, 2) for x in scaled_data])`
  }
];

export default function PlaygroundPage() {
  const [code, setCode] = useState(ML_SCRIPTS[0].code);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedScript, setSelectedScript] = useState(ML_SCRIPTS[0].id);

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast.error('Code cannot be empty');
      return;
    }

    setIsExecuting(true);
    setOutput('> Executing code command...\n');

    try {
      const res = await playgroundAPI.executeCode(code);
      const { stdout, stderr, status, message } = res.data;

      if (status === 'error') {
        setOutput(prev => prev + `Error: ${message}`);
        toast.error('Execution failed');
      } else {
        let result = stdout || '';
        if (stderr) result += `\n--- Errors ---\n${stderr}`;
        if (!stdout && !stderr) result = '(Execution successful, but no output produced)';
        
        setOutput(prev => prev + result);
        toast.success('Code executed successfully');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Internal server error';
      setOutput(prev => prev + `\nFatal Error: ${errorMsg}`);
      toast.error('Failed to reach execution engine');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleScriptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scriptId = e.target.value;
    const script = ML_SCRIPTS.find(s => s.id === scriptId);
    if (script) {
      if (code !== script.code && !window.confirm('You have unsaved changes. Change script?')) return;
      setSelectedScript(scriptId);
      setCode(script.code);
      setOutput('');
    }
  };

  const handleReset = () => {
    const script = ML_SCRIPTS.find(s => s.id === selectedScript);
    if (script && window.confirm('Reset current code to template?')) {
      setCode(script.code);
      setOutput('');
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Header toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Terminal size={20} color="#0d0f14" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', fontFamily: 'Space Grotesk' }}>
                Python Playground
              </h1>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Write, edit, and experiment with ML logic.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileCode size={16} className="text-muted" />
              <select 
                value={selectedScript}
                onChange={handleScriptChange}
                style={{
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {ML_SCRIPTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <Button 
              variant="secondary" 
              onClick={handleReset}
              icon={<RotateCcw size={16} />}
              style={{ padding: '8px 16px' }}
            >
              Reset
            </Button>

            <Button 
              onClick={handleRunCode}
              disabled={isExecuting}
              icon={isExecuting ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
              style={{ padding: '8px 20px', minWidth: 120 }}
            >
              {isExecuting ? 'Running...' : 'Run Code'}
            </Button>
          </div>
        </div>

        {/* Main Editor & Console Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, flex: 1, minHeight: 0 }}>
          
          {/* Editor Side */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <CodeEditor code={code} onChange={(val) => setCode(val || '')} />
          </div>

          {/* Output Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Console */}
            <Card padding="none" style={{ flex: 1, background: '#0d0f14', border: '1px solid #2a3045', borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#1e2330', padding: '10px 16px', borderBottom: '1px solid #2a3045', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginLeft: 10, letterSpacing: '0.05em' }}>TERMINAL</span>
              </div>
              
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: '#e0e0e0', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {output ? output : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-dim)', textAlign: 'center' }}>
                    <Sparkles size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                    <p>Output will appear here after execution.</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Hint / Security Info */}
            <Card padding="sm" style={{ background: 'rgba(245,197,24,0.05)', border: '1px solid rgba(245,197,24,0.1)' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <AlertCircle size={18} className="text-primary" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  This environment runs in a <strong>secure ephemeral sandbox</strong>. 
                  File system and network access are disabled for security. 
                  Max execution time: 3.0s.
                </p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
