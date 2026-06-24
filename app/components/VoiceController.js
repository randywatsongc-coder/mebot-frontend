"use client";

import { useState, useEffect, useRef } from "react";

export default function VoiceController({ onCommand }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Browser speech recognition
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
      onCommand(transcript);
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
