'use client';

export default function Gen6Robot({ bot, emotion }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#0d0d0d',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexDirection: 'column',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '180px',
          height: '260px',
          background: '#1a1a1a',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          opacity: 0.8
        }}
      >
        {/* Avatar placeholder */}
        GEN‑6 Avatar
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>{bot?.name}</h3>
        <p style={{ margin: '4px 0', fontSize: '14px', opacity: 0.7 }}>
          {bot?.personality} • {emotion}
        </p>
      </div>
    </div>
  );
}
