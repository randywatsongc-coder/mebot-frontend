'use client';

export default function Gen6Robot({ bot, emotion }) {
  return (
    <div
      style={{
        width: '100%',
        background: '#0d0d0d',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        color: '#fff'
      }}
    >
      {/* GEN‑6# Info Panel */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>{bot?.name}</h2>
        <p style={{ margin: '6px 0', fontSize: '14px', opacity: 0.7 }}>
          {bot?.personality} • {emotion}
        </p>
      </div>

      {/* Placeholder for future emotion indicators */}
      <div
        style={{
          width: '100%',
          height: '60px',
          background: '#1a1a1a',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
          fontSize: '13px'
        }}
      >
        GEN‑6# Status Panel
      </div>
    </div>
  );
}
