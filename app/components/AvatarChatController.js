"use client";

import { useEffect } from "react";
import { sendAvatarEvent } from "@/app/events/avatarEvents";

export default function AvatarChatController({ message }) {
  useEffect(() => {
    if (!message) return;

    const lower = message.toLowerCase();

    // Actions
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
  }, [message]);

  return null;
}
