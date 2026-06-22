'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BotList() {
  const [bots, setBots] = useState([]);

  useEffect(() => {
    const storedBots = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('bot-')) {
        const bot = JSON.parse(localStorage.getItem(key));
        storedBots.push(bot);
      }
    }
    setBots(storedBots);
  }, []);

  return (
    <main style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>
        Your MeBots
      </h1>

      {bots.length === 0 && (
        <p>You haven't created any bots yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {bots.map(bot => (
          <div
            key={bot.id}
            style={{
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '10px'
            }}
          >
            <h2 style={{ marginBottom: '10px' }}>{bot.name}</h2>
            <p style={{ marginBottom: '20px' }}>
              Personality: {bot.personality}
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                href={`/bots/${bot.id}`}
                style={{
                  padding: '10px 20px',
                  background: '#6366f1',
                  color: '#fff',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                View
              </Link>

              <Link
                href={`/bots/${bot.id}/chat`}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                Chat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
