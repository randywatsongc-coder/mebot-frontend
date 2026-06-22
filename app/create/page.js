'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBot() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('Friendly');

  const createBot = () => {
    if (!name.trim()) return;

    const id = Date.now().toString();

    const newBot = {
      id,
      name,
      personality
    };

    localStorage.setItem(`bot-${id}`, JSON.stringify(newBot));

    // Redirect directly to chat
    router.push(`/bots/${id}/chat`);
  };

  return (
    <main style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>
        Create Your MeBot
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        <input
          placeholder="Bot Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <select
          value={personality}
          onChange={e => setPersonality(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        >
          <option>Friendly</option>
          <option>Funny</option>
          <option>Serious</option>
          <option>Chaotic</option>
          <option>Wise</option>
        </select>

        <button
          onClick={createBot}
          style={{
            padding: '12px 24px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          Create Bot
        </button>
      </div>
    </main>
  );
}
