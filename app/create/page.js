'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBot() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('Friendly');
  const [baseModel, setBaseModel] = useState('gen6-male');
  const [preview, setPreview] = useState(null);

  const createBot = () => {
    if (!name.trim()) return;

    const id = Date.now().toString();

    const newBot = {
      id,
      name,
      personality,
      baseModel,
      avatar: preview || null
    };

    localStorage.setItem(`bot-${id}`, JSON.stringify(newBot));

    router.push(`/bots/${id}/chat`);
  };

  return (
    <main style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>
        Create Your Gen‑6 MeBot
      </h1>

      <div style={{ display: 'flex', gap: '40px' }}>
        
        {/* LEFT SIDE — FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '350px' }}>
          
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

          <select
            value={baseModel}
            onChange={e => setBaseModel(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          >
            <option value="gen6-male">Gen‑6 Male Robot</option>
            <option value="gen6-female">Gen‑6 Female Robot</option>
            <option value="gen6-human-male">Human Male</option>
            <option value="gen6-human-female">Human Female</option>
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

        {/* RIGHT SIDE — PREVIEW */}
        <div
          style={{
            width: '350px',
            height: '450px',
            border: '1px solid #ddd',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa'
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Bot Preview"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <p style={{ color: '#777' }}>Gen‑6 Preview Coming Soon</p>
          )}
        </div>

      </div>
    </main>
  );
}
