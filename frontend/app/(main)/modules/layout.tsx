import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modules — AIML Learning',
  description: 'Browse all AI and ML learning modules — Decision Trees, Linear Regression, and more.',
};

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
