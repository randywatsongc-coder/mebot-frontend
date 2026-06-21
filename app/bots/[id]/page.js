'use client';

import { useEffect, useState } from 'react';

export default function BotProfile({ params }) {
  const { id } = params;
  const [bot, setBot] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) {
      setBot(JSON.parse(saved));
    }
  }, [id]);

  if (!bot) {
    return (
      <main style={{ padding: "60px" }}>
        <h1>Bot Not Found</h1>
        <p>No bot exists with ID: {id}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "60px" }}>
      <h1>Bot Profile</h1>
      <p>This is the public page for your MeBot.</p>

      <div
        style={{
          marginTop: "40px",
          padding: "30px",
          background: "#0a0f24",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <h2>{bot.avatar} {bot.name}</h2>
        <p><strong>ID:</strong> {bot.id}</p>
        <p><strong>Personality:</strong> {bot.personality}</p>
      </div>
    </main>
  );
}
