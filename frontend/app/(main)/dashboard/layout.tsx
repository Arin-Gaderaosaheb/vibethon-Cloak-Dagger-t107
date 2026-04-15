import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — AIML Learning',
  description: 'Your learning dashboard — track module progress, scores, and total points earned.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
