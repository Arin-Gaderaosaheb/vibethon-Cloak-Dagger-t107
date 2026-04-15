export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: 'var(--gradient-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pulse-glow 1.5s ease-in-out infinite',
      }}>
        <span style={{ fontSize: 24 }}>🧠</span>
      </div>
      <div className="spinner" style={{ width: 28, height: 28 }} />
      <p style={{ color: 'var(--color-text-dim)', fontSize: 14 }}>Loading...</p>
    </div>
  );
}
