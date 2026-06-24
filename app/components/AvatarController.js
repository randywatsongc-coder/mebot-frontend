"use client";

import { useState, useEffect } from "react";

export default function AvatarController({ onChange }) {
  const [command, setCommand] = useState("");

  const handleCommand = () => {
    if (!command.trim()) return;

    const normalized = command.toLowerCase();

    if (normalized.includes("closer")) onChange("move-forward");
    else if (normalized.includes("back")) onChange("move-back");
    else if (normalized.includes("left")) onChange("turn-left");
    else if (normalized.includes("right")) onChange("turn-right");
    else if (normalized.includes("face")) onChange("camera-face");
    else if (normalized.includes("full")) onChange("camera-full");
    else if (normalized.includes("dance")) onChange("dance");
    else onChange("idle");

    setCommand("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Type a command..."
        style={{
          width: "260px",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #333",
          background: "#0a0f24",
          color: "#fff",
        }}
      />

      <button
        onClick={handleCommand}
        style={{
          marginLeft: "10px",
          padding: "10px 16px",
          background: "#6366f1",
          color: "#fff",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
