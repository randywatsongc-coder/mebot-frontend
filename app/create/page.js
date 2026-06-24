"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBotPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🤖");
  const [personality, setPersonality] = useState("fun");

  const avatars = ["🤖", "🧠", "👾", "🦾", "🛸", "🐉"];
  const personalities = ["fun", "serious", "chaotic", "calm"];

  const createBot = () => {
    if (!name.trim()) return;

    const id = Date.now().toString();

    const bot = {
      id,
      name,
      avatar,
      personality
    };

    localStorage.setItem(`bot-${id}`, JSON.stringify(bot));

    router.push(`/bots/${id}`);
  };

  return (
    <main
      style={{
        padding: "60px",
        maxWidth: "600px",
        margin: "0 auto",
        color: "#fff"
      }}
    >
      <h1>Create Your MeBot</h1>
      <p style={{ opacity: 0.8 }}>Choose your bot’s identity and personality.</p>

      {/* Name */}
      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Bot Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter bot name..."
          style={inputBox}
        />
      </div>

      {/* Avatar */}
      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Avatar</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {avatars.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              style={{
                ...avatarBtn,
                background: avatar === a ? "#6366f1" : "#1e293b"
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Personality */}
      <div style={{ marginTop: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>Personality</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {personalities.map((p) => (
            <button
              key={p}
              onClick={() => setPersonality(p)}
              style={{
                ...avatarBtn,
                background: personality === p ? "#6366f1" : "#1e293b"
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <button onClick={createBot} style={createBtn}>
        Create MeBot
      </button>
    </main>
  );
}

const inputBox = {
  padding: "12px",
  width: "100%",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#fff",
  fontSize: "16px"
};

const avatarBtn = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "20px",
  color: "#fff"
};

const createBtn = {
  marginTop: "40px",
  padding: "14px 24px",
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "18px",
  width: "100%"
};
