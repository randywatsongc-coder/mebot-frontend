"use client";

import { useEffect, useRef } from "react";

export default function BotSpeaker({ text }) {
  const lastText = useRef("");

  useEffect(() => {
    if (!text || text === lastText.current) return;

    lastText.current = text;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.pitch = 1;
    utter.rate = 1;
    utter.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [text]);

  return null; // No UI needed — this is audio only
}
