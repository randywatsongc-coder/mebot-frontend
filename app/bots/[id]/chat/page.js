"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [memory, setMemory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(`bot-${id}`);
    if (saved) {
      setBot(JSON.parse(saved));
    }
  }, [id]);

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

  const handleVoiceCommand = (text) => {
    if (!text.trim()) return;

    const userMsg = { from: "user", text };
    const botReply = generateBotReply(text);

    setMessages((prev) => [...prev, userMsg, botReply]);
    setMemory((prev) => [...prev, text]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const botReply = generateBotReply(input);

    setMessages((prev) => [...prev, userMsg, botReply]);
    setMemory((prev) => [...prev, input]);
    setInput("");
  };

  const generateBotReply = (msg) => {
    if (!bot) return { from: "bot", text: "..." };

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

    // ⭐ STEP 4 — LIP‑SYNC START
    emitAvatarEvent({ type: "speak-start" });

    // Personality emojis
    const personality = {
      fun: ["😄", "🎉", "🔥", "😎"],
      serious: ["...", ".", "Indeed.", "Understood."],
      chaotic: ["💥", "⚡", "👀", "BROOOO"],
      calm: ["✨", "🌿", "🕊️", "softly..."],
    };

    const p = personality[bot.personality] || ["🙂"];

    // Commands
    if (lower.includes("help")) {
      reply = `${p[2]} I can move, dance, jump, react, change scenes, and show emotions.`;
    } else if (lower.includes("dance")) {
      emitAvatarEvent({ type: "dance" });
      reply = `${p[3]} Dancing now! 💃🕺`;
    } else if (lower.includes("scene")) {
      emitAvatarEvent({ type: "scene", value: "neon" });
      reply = `${p[0]} Switching scenes!`;
    } else if (lower.includes("joke")) {
      reply = `${p[1]} Why did the robot go to therapy? Too many bytes of emotional baggage.`;
    } else if (lower.includes("remember")) {
      reply = `${p[2]} You told me: "${memory.join(", ")}"`;
    }

    // Emotion‑based replies
    else if (detectedEmotion === "happy") reply = `${p[0]} Love that energy!`;
    else if (detectedEmotion === "sad") reply = `${p[3]} I'm here for you.`;
    else if (detectedEmotion === "angry") reply = `${p[2]} I feel that fire.`;
    else if (detectedEmotion === "thinking") reply = `${p[1]} Hmm… thinking.`;
    else if (detectedEmotion === "excited") reply = `${p[0]} LET’S GO!`;
    else if (detectedEmotion === "worried") reply = `${p[3]} It’s okay. I’m here.`;

    // Default
    else reply = `${p[1]} You said: "${msg}". Tell me more.`;

    // ⭐ STEP 4 — LIP‑SYNC STOP
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
