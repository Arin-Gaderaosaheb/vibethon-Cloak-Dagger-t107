'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#0d0f14', color: '#e8eaf2', fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, textAlign: 'center', padding: 24 }}>
        <div style={{ fontSize: 56 }}>⚠️</div>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Something went wrong</h1>
        <p style={{ color: '#8892a4', maxWidth: 400 }}>{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={reset}
          style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#f5c518,#ff9500)', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, color: '#0d0f14', cursor: 'pointer' }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
