"use client";

import { useState, useEffect, useRef } from "react";
import { sendAvatarEvent } from "@/app/events/avatarEvents";

export default function VoiceController({ onCommand }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);

    recog.onerror = (e) => {
      console.error("Voice error:", e);
      setListening(false);
    };

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();

      // Send raw text to chat
      if (onCommand) onCommand(transcript);

      const lower = transcript.toLowerCase();

      // Avatar actions
      if (lower.includes("dance")) sendAvatarEvent({ type: "dance" });
      if (lower.includes("wave")) sendAvatarEvent({ type: "wave" });
      if (lower.includes("jump")) sendAvatarEvent({ type: "jump" });

      // Emotions
      if (lower.includes("happy")) sendAvatarEvent({ type: "emotion", value: "happy" });
      if (lower.includes("sad")) sendAvatarEvent({ type: "emotion", value: "sad" });
      if (lower.includes("excited")) sendAvatarEvent({ type: "emotion", value: "excited" });
      if (lower.includes("thinking")) sendAvatarEvent({ type: "emotion", value: "thinking" });

      // Scene switching
      if (lower.includes("scene")) {
        const scene = lower.replace("scene", "").trim();
        sendAvatarEvent({ type: "scene", value: scene });
      }
    };

    recognitionRef.current = recog;
  }, [onCommand]);

  const toggle = () => {
    if (!recognitionRef.current) return;

    if (!listening) recognitionRef.current.start();
    else recognitionRef.current.stop();
  };

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
      <h3>Voice Control</h3>

      <button
        onClick={toggle}
        style={{
          padding: "12px 20px",
          background: listening ? "#ef4444" : "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px",
        }}
      >
        {listening ? "🎙 Stop Listening" : "🎤 Start Voice Command"}
      </button>

      {!recognitionRef.current && (
        <p style={{ marginTop: "10px", color: "#f87171" }}>
          Voice recognition not supported in this browser.
        </p>
      )}
    </div>
  );
}
