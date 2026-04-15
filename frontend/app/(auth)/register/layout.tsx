import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — AIML Learning',
  description: 'Sign up for free and start learning AI/ML concepts through interactive simulations and quizzes.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
