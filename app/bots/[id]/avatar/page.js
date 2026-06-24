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
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        {bot.avatar} {bot.name} — 3D Avatar
      </h1>

      {/* 3D Avatar Window */}
      <div
        style={{
          marginTop: "20px",
          background: "#000",
          borderRadius: "12px",
          padding: "0",
          height: "500px",
          overflow: "hidden",
        }}
      >
        <AvatarRenderer bot={bot} mode="full" />
      </div>

      {/* Avatar Controls */}
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
