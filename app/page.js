'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '60px' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        Welcome to MeBot
      </h1>

      <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '600px' }}>
        Create your own AI characters, give them personalities, and chat with them instantly.
        Your bots live in your browser and are always ready to talk.
      </p>

      <div style={{ display: 'flex', gap: '20px' }}>
        <Link
          href="/create"
          style={{
            padding: '14px 28px',
            background: '#6366f1',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '18px'
          }}
        >
          Create a Bot
        </Link>

        <Link
          href="/bots"
          style={{
            padding: '14px 28px',
            background: '#10b981',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '18px'
          }}
        >
          View Your Bots
        </Link>
      </div>
    </main>
  );
}
