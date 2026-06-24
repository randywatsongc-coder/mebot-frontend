"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BotSpeaker from "@/app/components/BotSpeaker";

export default function BotChatPage() {
  const { id } = useParams();
  const router = useRouter();

  const [bot, setBot] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

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
    setInput("");
  };

  const generateBotReply = (msg) => {
    if (!bot) return { from: "bot", text: "..." };

    const lower = msg.toLowerCase();
    let reply = "";

    if (lower.includes("hi") || lower.includes("hello")) {
      reply = `Hello! I'm ${bot.name}. How can I help you today?`;
    } else if (lower.includes("who are you")) {
      reply = `I'm ${bot.name}, your ${bot.personality} MeBot assistant.`;
    } else if (lower.includes("help")) {
      reply = "You can ask me to move, dance, talk, change scenes, or show emotions.";
    } else if (lower.includes("energy")) {
      reply = "My energy changes based on actions. Moving drains it, resting restores it.";
    } else if (lower.includes("mood")) {
      reply = "My mood shifts based on how you talk to me.";
    } else if (lower.includes("focus")) {
      reply = "My focus goes up when you interact and down when idle.";
    } else {
      reply = `You said: "${msg}". Tell me more.`;
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

      {/* Bot speaks the latest bot message */}
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
