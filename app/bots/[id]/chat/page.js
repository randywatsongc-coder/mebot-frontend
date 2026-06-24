"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import BotSpeaker from "@/app/components/BotSpeaker";
import AvatarChatController from "@/app/components/AvatarChatController";
import VoiceController from "@/app/components/VoiceController";
import { emitAvatarEvent } from "@/app/events/avatarEvents";

export default function BotChatPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bot, setBot] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // ⭐ STEP 6 — MEMORY ENGINE
  const [memory, setMemory] = useState({
    facts: [],
    preferences: [],
    dislikes: [],
    goals: [],
    misc: [],
  });

  // Load bot + memory
  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) setBot(JSON.parse(saved));

    const savedMemory = localStorage.getItem(`memory-${id}`);
    if (savedMemory) setMemory(JSON.parse(savedMemory));
  }, [id]);

  const saveMemory = (updated) => {
    setMemory(updated);
    localStorage.setItem(`memory-${id}`, JSON.stringify(updated));
  };

  // ⭐ STEP 6 — MEMORY TAGGING
  const analyzeMemory = (text) => {
    const t = text.toLowerCase();
    const updated = { ...memory };

    if (t.includes("i like") || t.includes("my favorite")) updated.preferences.push(text);
    if (t.includes("i hate") || t.includes("i don't like")) updated.dislikes.push(text);
    if (t.includes("my goal") || t.includes("i want to")) updated.goals.push(text);
    if (t.includes("i am") || t.includes("i live") || t.includes("i work")) updated.facts.push(text);

    updated.misc.push(text);

    Object.keys(updated).forEach((key) => {
      updated[key] = updated[key].slice(-20);
    });

    saveMemory(updated);
  };

  // ⭐ STEP 5 — IDLE TIMER
  const idleTimer = useRef(null);

  const startIdleLoop = () => {
    clearTimeout(idleTimer.current);

    idleTimer.current = setTimeout(() => {
      const idleActions = ["idle-look", "idle-blink", "idle-shift"];
      const pick = idleActions[Math.floor(Math.random() * idleActions.length)];

      emitAvatarEvent({ type: "idle", value: pick });

      startIdleLoop();
    }, 8000 + Math.random() * 4000);
  };

  const resetIdle = () => {
    clearTimeout(idleTimer.current);
    startIdleLoop();
  };

  useEffect(() => {
    startIdleLoop();
    return () => clearTimeout(idleTimer.current);
  }, []);

  // STEP 1 — AUTO‑EMOTION DETECTION
  const detectEmotion = (text) => {
    const t = text.toLowerCase();

    const emotionMap = [
      { emo: "happy", words: ["love", "great", "awesome", "nice", "good", "yay", "excited"] },
      { emo: "sad", words: ["sad", "down", "depressed", "upset", "hurt"] },
      { emo: "angry", words: ["angry", "mad", "furious", "pissed"] },
      { emo: "thinking", words: ["hmm", "thinking", "maybe", "idk"] },
      { emo: "excited", words: ["let’s go", "hype", "omg", "woo", "fire"] },
      { emo: "worried", words: ["worried", "scared", "anxious", "nervous"] },
    ];

    for (const group of emotionMap) {
      if (group.words.some((w) => t.includes(w))) return group.emo;
    }

    return "idle";
  };

  // STEP 2 — AUTO‑GESTURE DETECTION
  const detectGesture = (text) => {
    const t = text.toLowerCase();

    if (["yes", "yeah", "yup", "true", "exactly", "right"].some((w) => t.includes(w)))
      return { type: "gesture", value: "nod" };

    if (["no", "nah", "nope", "not really", "i disagree"].some((w) => t.includes(w)))
      return { type: "gesture", value: "shake" };

    if (["hi", "hello", "hey", "yo"].some((w) => t.includes(w)))
      return { type: "wave" };

    if (["why", "how", "explain", "tell me more", "what do you think"].some((w) => t.includes(w)))
      return { type: "gesture", value: "lean" };

    return null;
  };

  // STEP 3 — AUTO‑MOVEMENT DETECTION
  const detectMovement = (text) => {
    const t = text.toLowerCase();

    if (["wow", "no way", "what", "holy", "bro", "wtf"].some((w) => t.includes(w)))
      return { type: "jump" };

    if (["let’s go", "fire", "hype", "party", "turn up"].some((w) => t.includes(w)))
      return { type: "dance" };

    if (["what", "huh", "idk", "i don’t know", "confused"].some((w) => t.includes(w)))
      return { type: "gesture", value: "look" };

    return null;
  };

  // ⭐ STEP 7 — SCENE INTELLIGENCE
  const detectScene = (text, emotion) => {
    const t = text.toLowerCase();

    // Explicit user command overrides everything
    if (t.includes("scene")) return "neon";
    if (t.includes("dark mode")) return "dark";
    if (t.includes("studio")) return "studio";
    if (t.includes("room")) return "room";

    // Emotion‑based scenes
    if (emotion === "happy") return "studio";
    if (emotion === "excited") return "neon";
    if (emotion === "angry") return "dark";
    if (emotion === "sad") return "room";
    if (emotion === "worried") return "room";
    if (emotion === "thinking") return "studio";

    // Context‑based scenes
    if (t.includes("party") || t.includes("hype")) return "neon";
    if (t.includes("chill") || t.includes("relax")) return "room";

    return null;
  };

  const handleVoiceCommand = (text) => {
    if (!text.trim()) return;

    resetIdle();
    analyzeMemory(text);

    const userMsg = { from: "user", text };
    const botReply = generateBotReply(text);

    setMessages((prev) => [...prev, userMsg, botReply]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    resetIdle();
    analyzeMemory(input);

    const userMsg = { from: "user", text: input };
    const botReply = generateBotReply(input);

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  const generateBotReply = (msg) => {
    if (!bot) return { from: "bot", text: "..." };

    resetIdle();

    const lower = msg.toLowerCase();
    let reply = "";

    // STEP 1 — EMOTION
    const detectedEmotion = detectEmotion(msg);
    emitAvatarEvent({ type: "emotion", value: detectedEmotion });

    // STEP 2 — GESTURES
    const gesture = detectGesture(msg);
    if (gesture) emitAvatarEvent(gesture);

    // STEP 3 — MOVEMENT
    const movement = detectMovement(msg);
    if (movement) emitAvatarEvent(movement);

    // ⭐ STEP 7 — SCENE INTELLIGENCE
    const scene = detectScene(msg, detectedEmotion);
    if (scene) emitAvatarEvent({ type: "scene", value: scene });

    // STEP 4 — LIP‑SYNC START
    emitAvatarEvent({ type: "speak-start" });

    // Personality emojis
    const personality = {
      fun: ["😄", "🎉", "🔥", "😎"],
      serious: ["...", ".", "Indeed.", "Understood."],
      chaotic: ["💥", "⚡", "👀", "BROOOO"],
      calm: ["✨", "🌿", "🕊️", "softly..."],
    };

    const p = personality[bot.personality] || ["🙂"];

    // ⭐ STEP 6 — MEMORY‑AWARE RESPONSES
    const mem = memory;

    if (lower.includes("what do you remember")) {
      reply =
        `${p[1]} Here's what I remember:\n\n` +
        `• Preferences: ${mem.preferences.join("; ") || "none"}\n` +
        `• Dislikes: ${mem.dislikes.join("; ") || "none"}\n` +
        `• Facts: ${mem.facts.join("; ") || "none"}\n` +
        `• Goals: ${mem.goals.join("; ") || "none"}`;
    }

    else if (lower.includes("help")) {
      reply = `${p[2]} I can move, dance, jump, react, remember things, and change scenes automatically.`;
    }

    else if (lower.includes("dance")) {
      emitAvatarEvent({ type: "dance" });
      reply = `${p[3]} Dancing now! 💃🕺`;
    }

    else if (lower.includes("joke")) {
      reply = `${p[1]} Why did the robot go to therapy? Too many bytes of emotional baggage.`;
    }

    else if (lower.includes("remember")) {
      reply = `${p[2]} I remember: "${mem.misc.slice(-5).join(", ")}"`;
    }

    // Emotion‑based replies
    else if (detectedEmotion === "happy") reply = `${p[0]} Love that energy!`;
    else if (detectedEmotion === "sad") reply = `${p[3]} I'm here for you.`;
    else if (detectedEmotion === "angry") reply = `${p[2]} I feel that fire.`;
    else if (detectedEmotion === "thinking") reply = `${p[1]} Hmm… thinking.`;
    else if (detectedEmotion === "excited") reply = `${p[0]} LET’S GO!`;
    else if (detectedEmotion === "worried") reply = `${p[3]} It’s okay. I’m here.`;

    else reply = `${p[1]} You said: "${msg}". Tell me more.`;

    // STEP 4 — LIP‑SYNC STOP
    setTimeout(() => {
      emitAvatarEvent({ type: "speak-stop" });
    }, 400);

    return { from: "bot", text: reply };
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
    <main
      style={{
        padding: "60px",
        maxWidth: "700px",
        margin: "0 auto",
        color: "#fff",
      }}
    >
      <AvatarChatController
        message={
          messages.length > 0 && messages[messages.length - 1].from === "user"
            ? messages[messages.length - 1].text
            : ""
        }
      />

      <h1>
        Chat with {bot.avatar} {bot.name}
      </h1>

      <VoiceController onCommand={handleVoiceCommand} />

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#0f172a",
          borderRadius: "12px",
          height: "400px",
          overflowY: "auto",
        }}
      >
        {messages.length === 0 && (
          <p style={{ opacity: 0.6 }}>Start chatting with your MeBot...</p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: "15px",
              textAlign: m.from === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                background: m.from === "user" ? "#6366f1" : "#1e293b",
                borderRadius: "10px",
                maxWidth: "80%",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{
            padding: "12px",
            width: "70%",
            borderRadius: "8px",
            border: "1px solid "#334155",
            background: "#1e293b",
            color: "#fff",
            marginRight: "10px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            background: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </div>

      <BotSpeaker
        text={
          messages.length > 0 && messages[messages.length - 1].from === "bot"
            ? messages[messages.length - 1].text
            : ""
        }
      />

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
