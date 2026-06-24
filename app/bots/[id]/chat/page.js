"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BotSpeaker from "@/app/components/BotSpeaker";
import AvatarChatController from "@/app/components/AvatarChatController";

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

    const personality = {
      fun: ["😄", "🎉", "🔥", "😎"],
      serious: ["...", ".", "Indeed.", "Understood."],
      chaotic: ["💥", "⚡", "👀", "BROOOO"],
      calm: ["✨", "🌿", "🕊️", "softly..."]
    };

    const p = personality[bot.personality] || ["🙂"];

    const positiveWords = ["good", "great", "love", "awesome", "nice"];
    const negativeWords = ["bad", "sad", "angry", "upset", "hate"];

    let mood = "neutral";
    if (positiveWords.some((w) => lower.includes(w))) mood = "happy";
    if (negativeWords.some((w) => lower.includes(w))) mood = "sad";

    if (lower.includes("hi") || lower.includes("hello")) {
      reply = `${p[0]} Hey! I'm ${bot.name}. What’s up?`;
    } else if (lower.includes("who are you")) {
      reply = `${p[1]} I'm ${bot.name}, your ${bot.personality} MeBot.`;
    } else if (lower.includes("help")) {
      reply = `${p[2]} I can move, dance, change scenes, show emotions, and chat with personality.`;
    } else if (lower.includes("dance")) {
      reply = `${p[3]} Dancing now! 💃🕺`;
    } else if (lower.includes("scene")) {
      reply = `${p[0]} Switching scenes!`;
    } else if (lower.includes("joke")) {
      reply = `${p[1]} Here's one: Why did the robot go to therapy? Because it had too many *bytes* of emotional baggage.`;
    } else if (lower.includes("remember")) {
      reply = `${p[2]} I remember everything you say. So far you told me: "${memory.join(", ")}"`;
    } else if (mood === "happy") {
      reply = `${p[0]} I love that energy! Tell me more.`;
    } else if (mood === "sad") {
      reply = `${p[3]} I'm here for you. Want to talk about it?`;
    } else {
      reply = `${p[1]} You said: "${msg}". Interesting… tell me more.`;
    }

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
            border: "1px solid #334155",
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
