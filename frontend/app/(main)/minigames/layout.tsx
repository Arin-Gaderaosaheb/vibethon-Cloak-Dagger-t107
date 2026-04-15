import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mini Games — AIML Learning',
  description: 'Interactive mini-games to help establish intuition for AI and Machine Learning concepts.',
};

export default function MiniGamesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
