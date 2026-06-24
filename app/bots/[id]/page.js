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

  // ⭐ NEW: long‑term mood
  const [mood, setMood] = useState("neutral"); // positive | neutral | negative

  const [memory, setMemory] = useState([]);

  const [status, setStatus] = useState({
    lastAction: "idle",
    lastEmotion: "idle",
    lastGesture: "none",
    lastVoice: "none",
    lastTextCmd: "none",
    lastSpeech: "none",
    mood: "neutral"
  });

  const personalityLine = (emotion, personality, mood) => {
    const base = {
      idle: ["Just hanging out.", "Ready when you are.", "I'm here."],
      happy: ["Feeling great!", "Love the energy!", "This is fun!"],
      thinking: ["Let me think...", "Processing...", "Analyzing..."],
      excited: ["Let's go!", "I'm pumped!", "This is awesome!"],
      focused: ["Locked in.", "Staying sharp.", "I'm on it."]
    };

    const moodBoost = {
      positive: ["I'm feeling good today.", "Vibes are high.", "Everything feels smooth."],
      neutral: ["All normal here.", "Just doing my thing.", "Keeping steady."],
      negative: ["Feeling a bit off.", "Not my best moment.", "Trying to stay focused."]
    };

    const pool = base[emotion] || base.idle;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const moodPick = moodBoost[mood][Math.floor(Math.random() * moodBoost[mood].length)];

    let line = pick + " " + moodPick;

    if (personality === "fun") line += " 😄";
    if (personality === "serious") line += ".";

    return line;
  };

  const remember = (msg) => {
    setMemory((prev) => {
      const updated = [msg, ...prev];
      return updated.slice(0, 5);
    });

    // ⭐ Mood shifts based on user engagement
    if (msg.includes("hi") || msg.includes("hello")) {
      setMood("positive");
    } else if (msg.includes("stop") || msg.includes("no")) {
      setMood("negative");
    } else {
      setMood("neutral");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setBot(parsed);

      const intro = `Hello, I am ${parsed.name}. I am a ${parsed.personality} style MeBot.`;
      setSpeakText(intro);
      setEmotion("happy");
      setMood("positive");

      setStatus((s) => ({
        ...s,
        lastSpeech: intro,
        lastEmotion: "happy",
        mood: "positive"
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
      ? speech + " " + personalityLine(emo, bot.personality, mood)
      : personalityLine(emo, bot.personality, mood);

    setSpeakText(flavored);
    setEmotion(emo);

    setStatus((s) => ({
      ...s,
      lastAction: action,
      lastEmotion: emo,
      lastSpeech: flavored,
      mood
    }));
  }, [action, bot, mood]);

  const triggerGesture = (g) => {
    setGesture(g);

    let emo = "happy";
    let line = "";

    if (g === "wave") line = "Waving hello!";
    if (g === "nod") line = "Nodding.";
    if (g === "point") line = "Pointing.";
    if (g === "thumbs-up") line = "Thumbs up!";
    if (g === "salute") line = "Saluting.";

    const flavored = line + " " + personalityLine(emo, bot.personality, mood);

    setEmotion(emo);
    setSpeakText(flavored);

    setStatus((s) => ({
      ...s,
      lastGesture: g,
      lastEmotion: emo,
      lastSpeech: flavored,
      mood
    }));
  };

  useEffect(() => {
