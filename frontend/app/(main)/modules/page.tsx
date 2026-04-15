'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { modulesAPI, userAPI } from '@/lib/api';
import { BookOpen, CheckCircle2, ChevronRight, Zap, HelpCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  completed?: boolean;
}

const MODULE_META = [
  { emoji: '🌳', color: 'rgba(245,197,24,0.08)', border: 'rgba(245,197,24,0.2)', tag: 'Supervised Learning' },
  { emoji: '📈', color: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', tag: 'Regression' },
];

export default function ModulesPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [modRes, progRes] = await Promise.all([
          modulesAPI.getAll(),
          userAPI.getProgress(),
        ]);
        const progressMap: Record<number, boolean> = {};
        (progRes.data.progress || []).forEach((p: any) => {
          progressMap[p.module_id] = p.completed;
        });
        const mods = (modRes.data.modules || []).map((m: Module) => ({
          ...m,
          completed: progressMap[m.id] || false,
        }));
        setModules(mods);
      } catch {
        /* silently handled */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, background: 'var(--gradient-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="#0d0f14" />
            </div>
            <div>
              <h1 className="section-title" style={{ marginBottom: 0 }}>Learning Modules</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>
                {modules.filter(m => m.completed).length} of {modules.length} completed
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gap: 20 }}>
            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {modules.map((mod, idx) => {
              const meta = MODULE_META[idx % MODULE_META.length];
              return (
                <div key={mod.id} style={{
                  background: meta.color, border: `1px solid ${meta.border}`,
                  borderRadius: 20, padding: 28, display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                }}
                  className="card"
                  onClick={() => router.push(`/module/${mod.id}`)}
                >
                  {/* Icon */}
                  <div style={{ fontSize: 56, lineHeight: 1 }}>{meta.emoji}</div>

                  {/* Content */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {mod.title}
                      </h2>
                      <Badge variant="primary">{meta.tag}</Badge>
                      {mod.completed && <Badge variant="success">✓ Done</Badge>}
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 16, maxWidth: 500 }}>
                      {mod.description}
                    </p>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/module/${mod.id}/simulation`); }} icon={<Zap size={14} />}>
                        Simulation
                      </Button>
                      <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); router.push(`/module/${mod.id}/quiz`); }} icon={<HelpCircle size={14} />}>
                        Quiz
                      </Button>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    {mod.completed
                      ? <CheckCircle2 size={32} color="var(--color-success)" />
                      : <ChevronRight size={28} color="var(--color-text-dim)" />
                    }
                    <span style={{ fontSize: 12, color: mod.completed ? 'var(--color-success)' : 'var(--color-text-dim)', fontWeight: 600 }}>
                      {mod.completed ? 'Completed' : 'Start'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
