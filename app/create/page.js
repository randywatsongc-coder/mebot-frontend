"use client";

import { useEffect, useRef } from "react";

export default function BotSpeaker({ text }) {
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    // Stop any previous speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [text]);

  return (
    <div
      style={{
        background: "#0f172a",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
        color: "#fff",
      }}
    >
      <h3>Bot Speaker</h3>
      <p style={{ opacity: 0.8 }}>{text || "Bot is silent..."}</p>
    </div>
  );
}
