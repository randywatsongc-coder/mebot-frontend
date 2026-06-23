'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AvatarRenderer from '@/app/components/AvatarRenderer';

export default function BotProfile() {
  const { id } = useParams();
  const router = useRouter();
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

      {/* ⭐ GEN‑6# Avatar Renderer */}
      <div style={{ marginTop: "40px", marginBottom: "40px" }}>
        <AvatarRenderer mode="full" emotion="idle" />
      </div>

      <div
        style={{
          padding: "30px",
          background: "#0a0f24",
          borderRadius: "12px",
          width: "400px",
        }}
      >
        <h2>{bot.avatar} {bot.name}</h2>
        <p><strong>ID:</strong> {bot.id}</p>
        <p><strong>Personality:</strong> {bot.personality}</p>

        <button
          onClick={() => router.push(`/bots/${id}/chat`)}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            background: "#6366f1",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          Chat with {bot.name}
        </button>
      </div>
    </main>
  );
}
