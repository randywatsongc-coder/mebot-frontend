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

  const [action, setAction] = useState("idle");
  const [emotion, setEmotion] = useState("idle");
  const [gesture, setGesture] = useState("none");
  const [speakText, setSpeakText] = useState("");

  const [status, setStatus] = useState({
    lastAction: "idle",
    lastEmotion: "idle",
    lastGesture: "none",
    lastVoice: "none",
    lastTextCmd: "none",
    lastSpeech: "none"
  });

  const personalityLine = (emotion, personality) => {
    const lines = {
      idle: ["Just hanging out.", "Ready when you are.", "I'm here."],
      happy: ["Feeling great!", "Love the energy!", "This is fun!"],
      thinking: ["Let me think...", "Processing...", "Analyzing..."],
      excited: ["Let's go!", "I'm pumped!", "This is awesome!"],
      focused: ["Locked in.", "Staying sharp.", "I'm on it."]
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

  useEffect(() => {
    if (!action || !bot) return;

    let speech = "";
    let emo = emotion;

    if (action === "move-forward") { speech = "Moving closer."; emo = "focused"; }
    else if (action === "move-back") { speech = "Backing up."; emo = "idle"; }
    else if (action === "turn-left") { speech = "Turning left."; emo = "thinking"; }
    else if (action === "turn-right") { speech = "Turning right."; emo = "thinking"; }
    else if (action === "camera-face") { speech = "Showing my face."; emo = "happy"; }
    else if (action === "camera-full") { speech = "Showing full body."; emo = "idle"; }
    else if (action === "dance") { speech = "Activating dance mode."; emo = "excited"; }
    else { emo = "idle"; speech = ""; }

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

  // ⭐ NEW: Gesture handler
  const triggerGesture = (g) => {
    setGesture(g);

    let emo = "happy";
    let line = "";

    if (g === "wave") line = "Waving hello!";
    if (g === "nod") line = "Nodding.";
    if (g === "point") line = "Pointing.";
    if (g === "thumbs-up") line = "Thumbs up!";
    if (g === "salute") line = "Saluting.";

    const flavored = line + " " + personalityLine(emo, bot.personality);

    setEmotion(emo);
    setSpeakText(flavored);

    setStatus((s) => ({
      ...s,
      lastGesture: g,
      lastEmotion: emo,
      lastSpeech: flavored
    }));
  };

  // ⭐ Idle loop
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
    }, 10000 + Math.random() * 10000);

    return () => clearInterval(loop);
  }, [bot]);

  const handleTextCmd = (cmd) => {
    setAction(cmd);
    setStatus((s) => ({ ...s, lastTextCmd: cmd }));
  };

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

      <div style={{ marginTop: "40px", marginBottom: "20px" }}>
        <AvatarRenderer
          mode="full"
          emotion={emotion}
          action={action}
          gesture={gesture}
        />
      </div>

      <AvatarController onChange={handleTextCmd} />
      <VoiceController onCommand={handleVoiceCmd} />
      <BotSpeaker text={speakText} />

      {/* ⭐ Gesture Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => triggerGesture("wave")} style={btn}>👋 Wave</button>
        <button onClick={() => triggerGesture("nod")} style={btn}>👍 Nod</button>
        <button onClick={() => triggerGesture("point")} style={btn}>👉 Point</button>
        <button onClick={() => triggerGesture("thumbs-up")} style={btn}>👍 Thumbs Up</button>
        <button onClick={() => triggerGesture("salute")} style={btn}>🫡 Salute</button>
      </div>

      {/* Status Panel */}
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
        <h3>Live Bot Status</h3>
        <p><strong>Last Action:</strong> {status.lastAction}</p>
        <p><strong>Last Emotion:</strong> {status.lastEmotion}</p>
        <p><strong>Last Gesture:</strong> {status.lastGesture}</p>
        <p><strong>Last Voice Command:</strong> {status.lastVoice}</p>
        <p><strong>Last Text Command:</strong> {status.lastTextCmd}</p>
        <p><strong>Last Spoken Output:</strong> {status.lastSpeech}</p>
      </div>
    </main>
  );
}

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
