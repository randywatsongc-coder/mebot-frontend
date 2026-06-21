'use client';
import { useState } from 'react';

export default function CreateBot() {
  const [botName, setBotName] = useState('');

  return (
    <main style={{ padding: '60px' }}>
      <h1>Create Your Bot</h1>
      <p>Start building your AI-powered MeBot here.</p>

      <div style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="Bot Name"
          value={botName}
          onChange={(e) => setBotName(e.target.value)}
          style={{
            padding: '12px',
            width: '300px',
            borderRadius: '6px',
            border: '1px solid #333',
            background: '#0a0f24',
            color: '#fff'
          }}
        />
      </div>

      <button
        style={{
          marginTop: '20px',
          padding: '14px 28px',
          background: '#6366f1',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
        onClick={() => alert(`Bot name saved: ${botName}`)}
      >
        Continue
      </button>
    </main>
  );
}
