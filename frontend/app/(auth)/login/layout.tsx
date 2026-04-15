import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — AIML Learning',
  description: 'Sign in to your AIML Learning account and continue your AI/ML learning journey.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
