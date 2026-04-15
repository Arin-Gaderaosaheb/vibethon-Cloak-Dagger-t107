import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Scores — AIML Learning',
  description: 'View your quiz score history, total points earned, and best scores per module.',
};

export default function ScoresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
