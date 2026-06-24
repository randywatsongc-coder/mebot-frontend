"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AvatarRenderer from "@/app/components/AvatarRenderer";
import AvatarController from "@/app/components/AvatarController";

export default function AvatarPage() {
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
      <main style={{ padding: "60px", color: "#fff" }}>
        <h1>Bot Not Found</h1>
        <p>No bot exists with ID: {id}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px",
        color: "#fff",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>
        {bot.avatar} {bot.name} — 3D Avatar
      </h1>

      <div
        style={{
          marginTop: "30px",
          background: "#0f172a",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <AvatarRenderer bot={bot} />
      </div>

      <div style={{ marginTop: "30px" }}>
        <AvatarController bot={bot} />
      </div>

      <button
        onClick={() => router.push(`/bots/${id}`)}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          background: "#1e293b",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Back to Bot Profile
      </button>
    </main>
  );
}
