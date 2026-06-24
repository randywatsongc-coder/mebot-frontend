'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AvatarRenderer from '@/app/components/AvatarRenderer';
import AvatarController from '@/app/components/AvatarController';
import VoiceController from '@/app/components/VoiceController';
import BotSpeaker from '@/app/components/BotSpeaker';

export default function BotProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [bot, setBot] = useState(null);

  // ⭐ Unified action state for 3D movement + camera control
  const [action, setAction] = useState("idle");

  // ⭐ Emotion state
  const [emotion, setEmotion] = useState("idle");

  // ⭐ Spoken text state
  const [speakText, setSpeakText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) {
      setBot(JSON.parse(saved));
    }
  }, [id]);

  // ⭐ Automatic emotion + speech based on actions
  useEffect(() => {
    if (!action) return;

    if (action === "move-forward") {
      setSpeakText("Moving closer.");
      setEmotion("focused");
    }
    else if (action === "move-back") {
      setSpeakText("Backing up.");
      setEmotion("idle");
    }
    else if (action === "turn-left") {
      setSpeakText("Turning left.");
      setEmotion("thinking");
    }
    else if (action === "turn-right") {
      setSpeakText("Turning right.");
      setEmotion("thinking");
    }
    else if (action === "camera-face") {
      setSpeakText("Showing my face.");
      setEmotion("happy");
    }
    else if (action === "camera-full") {
      setSpeakText("Showing full body.");
      setEmotion("idle");
    }
    else if (action === "dance") {
      setSpeakText("Activating dance mode.");
      setEmotion("excited");
    }
    else {
      setEmotion("idle");
      setSpeakText("");
    }
  }, [action]);

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
      <div style={{ marginTop: "40px", marginBottom: "20px" }}>
        <AvatarRenderer
          mode="full"
          emotion={emotion}
          action={action}
        />
      </div>

      {/* ⭐ Text Command Controller */}
      <AvatarController onChange={(cmd) => setAction(cmd)} />

      {/* ⭐ Voice Command Controller */}
      <VoiceController onCommand={(cmd) => setAction(cmd)} />

      {/* ⭐ Bot Speech Output */}
      <BotSpeaker text={speakText} />

      {/* ⭐ NEW: Manual Emotion Controls */}
      <div style={{ marginTop: "30px", marginBottom: "30px" }}>
        <h3>Emotion Controls</h3>

        <button onClick={() => setEmotion("idle")} style={btn}>😐 Idle</button>
        <button onClick={() => setEmotion("happy")} style={btn}>😊 Happy</button>
        <button onClick={() => setEmotion("thinking")} style={btn}>🤔 Thinking</button>
        <button onClick={() => setEmotion("excited")} style={btn}>😎 Excited</button>
        <button onClick={() => setEmotion("focused")} style={btn}>🎯 Focused</button>
      </div>

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
        <p><strong>Emotion:</strong> {emotion}</p>

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

// ⭐ Button style
const btn = {
  padding: "10px 16px",
  marginRight: "10px",
  background: "#1e293b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px"
};
