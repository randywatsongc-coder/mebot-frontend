'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BotList() {
  const [bots, setBots] = useState([]);

  useEffect(() => {
    const allBots = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith('bot-')) {
        const bot = JSON.parse(localStorage.getItem(key));
        allBots.push(bot);
      }
    }

    setBots(allBots);
  }, []);

  return (
    <main style={{ padding: '60px' }}>
      <h1>Your Bots</h1>
      <p>All MeBots you’ve created.</p>

      <div style={{ marginTop: '40px' }}>
        {bots.length === 0 && <p>You haven’t created any bots yet.</p>}

        {bots.map((bot) => (
          <div
            key={bot.id}
            style={{
              marginBottom: '20px',
              padding: '20px',
              background: '#0a0f24',
              borderRadius: '10px',
              width: '400px'
            }}
          >
            <h2>{bot.avatar} {bot.name}</h2>
            <p><strong>Personality:</strong> {bot.personality}</p>

            <Link
              href={`/bots/${bot.id}`}
              style={{
                marginTop: '10px',
                display: 'inline-block',
                padding: '10px 20px',
                background: '#6366f1',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              View Bot
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
