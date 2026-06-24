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

  // ⭐ Status panel state
  const [status, setStatus] = useState({
    lastAction: "idle",
    lastEmotion: "idle",
    lastVoice: "none",
    lastTextCmd: "none",
    lastSpeech: "none"
  });

  // ⭐ Personality line generator
  const personalityLine = (emotion, personality) => {
    const lines = {
      idle: [
        "Just hanging out.",
        "Ready when you are.",
        "I'm here if you need me."
      ],
      happy: [
        "Feeling great!",
        "Love the energy!",
        "This is fun!"
      ],
      thinking: [
        "Let me think...",
        "Processing...",
        "Analyzing the situation."
      ],
      excited: [
        "Let's gooo!",
        "I'm pumped!",
        "This is awesome!"
      ],
      focused: [
        "Locked in.",
        "Staying sharp.",
        "I'm on it."
      ]
    };

    const pool = lines[emotion] || lines.idle;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    return personality === "fun"
      ? pick + " 😄"
      : personality === "serious"
      ? pick + "."
      : pick;
  };

  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setBot(parsed);

      // ⭐ Auto‑introduction
      const intro = `Hello, I am ${parsed.name}. I am a ${parsed.personality} style MeBot.`;
      setSpeakText(intro);
      setEmotion("happy");

      setStatus((s) => ({
        ...s,
        lastSpeech: intro,
        lastEmotion: "happy"
      }));
    }
  }, [id]);

  // ⭐ Automatic emotion + speech based on actions
  useEffect(() => {
    if (!action || !bot) return;

    let speech = "";
    let emo = emotion;

    if (action === "move-forward") {
      speech = "Moving closer.";
      emo = "focused";
    }
    else if (action === "move-back") {
      speech = "Backing up.";
      emo = "idle";
    }
    else if (action === "turn-left") {
      speech = "Turning left.";
      emo = "thinking";
    }
    else if (action === "turn-right") {
      speech = "Turning right.";
      emo = "thinking";
    }
    else if (action === "camera-face") {
      speech = "Showing my face.";
      emo = "happy";
    }
    else if (action === "camera-full") {
      speech = "Showing full body.";
      emo = "idle";
    }
    else if (action === "dance") {
      speech = "Activating dance mode.";
      emo = "excited";
    }
    else {
      emo = "idle";
      speech = "";
    }

    const flavored = speech
      ? speech + " " + personalityLine(emo, bot.personality)
      : personalityLine(emo, bot.personality);

    setSpeakText(flavored);
    setEmotion(emo);

    setStatus((s) => ({
      ...s,
      lastAction: action,
      lastEmotion: emo,
      lastSpeech: flavored
    }));
  }, [action, bot]);

  // ⭐ NEW: Idle loop (every 10–20 seconds)
  useEffect(() => {
    if (!bot) return;

    const loop = setInterval(() => {
      const idleEmotions = ["idle", "happy", "thinking"];
      const emo = idleEmotions[Math.floor(Math.random() * idleEmotions.length)];

      const line = personalityLine(emo, bot.personality);

      setEmotion(emo);
      setSpeakText(line);

      setStatus((s) => ({
        ...s,
        lastEmotion: emo,
        lastSpeech: line
      }));
    }, 10000 + Math.random() * 10000); // 10–20 seconds

    return () => clearInterval(loop);
  }, [bot]);

  // ⭐ Capture text command source
  const handleTextCmd = (cmd) => {
    setAction(cmd);
    setStatus((s) => ({ ...s, lastTextCmd: cmd }));
  };

  // ⭐ Capture voice command source
  const handleVoiceCmd = (cmd) => {
    setAction(cmd);
    setStatus((s) => ({ ...s, lastVoice: cmd }));
  };

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
      <AvatarController onChange={handleTextCmd} />

      {/* ⭐ Voice Command Controller */}
      <VoiceController onCommand={handleVoiceCmd} />

      {/* ⭐ Bot Speech Output */}
      <BotSpeaker text={speakText} />

      {/* ⭐ Live Status Panel */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#111827",
          borderRadius: "12px",
          width: "420px",
          color: "#fff",
          fontSize: "15px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Live Bot Status</h3>
        <p><strong>Last Action:</strong> {status.lastAction}</p>
        <p><strong>Last Emotion:</strong> {status.lastEmotion}</p>
        <p><strong>Last Voice Command:</strong> {status.lastVoice}</p>
        <p><strong>Last Text Command:</strong> {status.lastTextCmd}</p>
        <p><strong>Last Spoken Output:</strong> {status.lastSpeech}</p>
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
