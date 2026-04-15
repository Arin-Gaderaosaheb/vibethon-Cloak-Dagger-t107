'use client';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { Gamepad2, BrainCircuit, BoxSelect, Network } from 'lucide-react';

export default function MiniGamesOverview() {
  const router = useRouter();

  const games = [
    {
      id: 'decision-tree',
      title: 'Decision Tree Detective',
      description: 'Follow the branches by answering yes/no questions to reach a final classification!',
      icon: <BrainCircuit size={40} className="text-[var(--color-primary)]" />,
      color: '#f5c518',
    },
    {
      id: 'classification',
      title: 'Quick Sort Classification',
      description: 'Group items into correct categories as fast as possible to test your intuition.',
      icon: <BoxSelect size={40} className="text-[#3b82f6]" />,
      color: '#3b82f6',
    },
    {
      id: 'neural-network',
      title: 'Neural Network Basics',
      description: 'Adjust weights in real-time to see how a signal travels through hidden layers to create an output.',
      icon: <Network size={40} className="text-[#22c55e]" />,
      color: '#22c55e',
    },
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Gamepad2 size={28} color="#0d0f14" />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', marginBottom: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
              Mini Games
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Interactive brain exercises to build intuition.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {games.map((game) => (
            <Card key={game.id} style={{ display: 'flex', flexDirection: 'column', padding: '32px 24px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: 16, background: `${game.color}15`,
                border: `1px solid ${game.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                {game.icon}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12, fontFamily: 'Space Grotesk' }}>
                {game.title}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.6, flex: 1, marginBottom: 24 }}>
                {game.description}
              </p>
              <Button style={{ width: '100%' }} onClick={() => router.push(`/minigames/${game.id}`)}>
                Play Now →
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
