import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'AIML Learning — Interactive AI/ML Concepts',
  description:
    'Master AI & Machine Learning concepts through interactive simulations, quizzes, and instant feedback. Built for beginners and students.',
  keywords: 'AI, Machine Learning, Decision Trees, Linear Regression, Interactive Learning',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1e2330',
              color: '#e8eaf2',
              border: '1px solid #2a3045',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f5c518', secondary: '#0d0f14' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
