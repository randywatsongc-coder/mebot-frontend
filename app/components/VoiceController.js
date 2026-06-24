"use client";

import { useState, useEffect, useRef } from "react";

export default function VoiceController({ onCommand }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      if (transcript.includes("closer")) onCommand("move-forward");
      else if (transcript.includes("back")) onCommand("move-back");
      else if (transcript.includes("left")) onCommand("turn-left");
      else if (transcript.includes("right")) onCommand("turn-right");
      else if (transcript.includes("face")) onCommand("camera-face");
      else if (transcript.includes("full")) onCommand("camera-full");
      else if (transcript.includes("dance")) onCommand("dance");
      else onCommand("idle");
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, [onCommand]);

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <button
        onClick={startListening}
        style={{
          padding: "12px 20px",
          background: listening ? "#22c55e" : "#6366f1",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {listening ? "Listening..." : "🎤 Voice Command"}
      </button>
    </div>
  );
}
