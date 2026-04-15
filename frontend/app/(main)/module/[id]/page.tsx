'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { modulesAPI } from '@/lib/api';
import {
  BookOpen, Zap, HelpCircle, ChevronRight, ArrowLeft,
  Lightbulb, CheckCircle, XCircle, Star,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ModuleContent {
  concept: string;
  realWorldExample: string;
  keyTerms: { term: string; definition: string }[];
  howItWorks: string[];
  advantages: string[];
  disadvantages: string[];
  simulationType: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  content: ModuleContent;
}

export default function ModuleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'howItWorks' | 'keyTerms'>('overview');

  useEffect(() => {
    modulesAPI.getById(id as string)
      .then((res) => setModule(res.data.module))
      .catch(() => toast.error('Failed to load module'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <MainLayout>
      <div style={{ display: 'grid', gap: 16 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }} />)}
      </div>
    </MainLayout>
  );

  if (!module) return (
    <MainLayout>
      <div style={{ textAlign: 'center', padding: 64 }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Module not found.</p>
      </div>
    </MainLayout>
  );

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'howItWorks', label: 'How It Works' },
    { key: 'keyTerms', label: 'Key Terms' },
  ] as const;

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Back */}
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 24 }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,197,24,0.12) 0%, rgba(255,149,0,0.08) 100%)',
          border: '1px solid rgba(245,197,24,0.2)',
          borderRadius: 20, padding: 32, marginBottom: 24,
        }}>
          <Badge variant="primary" style={{ marginBottom: 12 }}>Module {module.id}</Badge>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 800, color: 'var(--color-text)', marginBottom: 10 }}>
            {module.title}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 600, lineHeight: 1.6 }}>
            {module.description}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <Button onClick={() => router.push(`/module/${id}/simulation`)} icon={<Zap size={16} />}>
              Start Simulation
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/module/${id}/quiz`)} icon={<HelpCircle size={16} />}>
              Take Quiz
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--color-surface)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.key ? '#0d0f14' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab.key ? 700 : 400,
                fontSize: 14, transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <Card>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <BookOpen size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>What Is It?</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: 15 }}>
                {module.content.concept}
              </p>
            </Card>
            <Card>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <Lightbulb size={20} color="var(--color-warning)" />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>Real-World Example</h2>
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: 15 }}>
                {module.content.realWorldExample}
              </p>
            </Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <CheckCircle size={18} color="var(--color-success)" />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Advantages</h3>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {module.content.advantages.map((a, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>✓</span> {a}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <XCircle size={18} color="var(--color-error)" />
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)' }}>Disadvantages</h3>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {module.content.disadvantages.map((d, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--color-error)', flexShrink: 0 }}>✗</span> {d}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'howItWorks' && (
          <Card>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>Step-by-Step Process</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {module.content.howItWorks.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#0d0f14',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.7, paddingTop: 6 }}>{step}</p>
                    {i < module.content.howItWorks.length - 1 && (
                      <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0 0' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'keyTerms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {module.content.keyTerms.map((kt, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Star size={14} color="var(--color-primary)" style={{ marginTop: 2 }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)' }}>{kt.term}</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{kt.definition}</p>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Bar */}
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <Button size="lg" onClick={() => router.push(`/module/${id}/simulation`)} icon={<Zap size={18} />}>
            Start Interactive Simulation
          </Button>
          <Button size="lg" variant="secondary" onClick={() => router.push(`/module/${id}/quiz`)} icon={<HelpCircle size={18} />}>
            Take Quiz
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
