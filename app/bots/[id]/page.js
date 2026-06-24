"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AvatarRenderer from "@/app/components/AvatarRenderer";

export default function BotProfilePage() {
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
        padding: "60px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
        {bot.avatar} {bot.name}
      </h1>

      <p style={{ opacity: 0.7, marginTop: "5px", fontSize: "18px" }}>
        Personality: <strong>{bot.personality}</strong>
      </p>

      {/* 3D Avatar Preview */}
      <div
        style={{
          marginTop: "40px",
          background: "#0a0f24",
          borderRadius: "12px",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>3D Avatar Preview</h2>

        <div
          style={{
            height: "350px",
            borderRadius: "12px",
            overflow: "hidden",
            background: "#000",
          }}
        >
          <AvatarRenderer mode="full" emotion="idle" action="idle" />
        </div>
      </div>

      {/* Bot Stats */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          background: "#0f172a",
          borderRadius: "12px",
        }}
      >
        <h2>Bot Stats</h2>
        <p style={{ opacity: 0.7 }}>Mood: 😊 (placeholder)</p>
        <p style={{ opacity: 0.7 }}>Energy: 100% (placeholder)</p>
        <p style={{ opacity: 0.7 }}>Focus: 100% (placeholder)</p>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "40px" }}>
        <button
          onClick={() => router.push(`/bots/${id}/chat`)}
          style={{
            padding: "14px 24px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            width: "100%",
            marginBottom: "15px",
          }}
        >
          Chat with {bot.name}
        </button>

        <button
          onClick={() => router.push(`/bots/${id}/avatar`)}
          style={{
            padding: "14px 24px",
            background: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
            width: "100%",
          }}
        >
          Open Full 3D Avatar
        </button>
      </div>

      <button
        onClick={() => router.push("/")}
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
        ← Back Home
      </button>
    </main>
  );
}
