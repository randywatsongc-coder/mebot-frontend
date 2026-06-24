"use client";

import { useState } from "react";

export default function AvatarController({ onChange }) {
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    onChange(input.trim());
    setInput("");
  };

  const quick = (cmd) => onChange(cmd);

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
      <h3>Controls</h3>

      {/* Movement */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => quick("move-forward")} style={btn}>⬆ Forward</button>
        <button onClick={() => quick("move-back")} style={btn}>⬇ Back</button>
        <button onClick={() => quick("turn-left")} style={btn}>⬅ Left</button>
        <button onClick={() => quick("turn-right")} style={btn}>➡ Right</button>
      </div>

      {/* Camera */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => quick("camera-face")} style={btn}>🎥 Face</button>
        <button onClick={() => quick("camera-full")} style={btn}>📸 Full Body</button>
      </div>

      {/* Actions */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => quick("dance")} style={btn}>💃 Dance</button>
      </div>

      {/* Text Command */}
      <div style={{ marginTop: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a command..."
          style={inputBox}
        />
        <button onClick={send} style={sendBtn}>Send</button>
      </div>
    </div>
  );
}

const btn = {
  padding: "10px 14px",
  marginRight: "10px",
  background: "#1e293b",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};

const inputBox = {
  padding: "10px",
  width: "70%",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "#fff",
  marginRight: "10px",
};

const sendBtn = {
  padding: "10px 16px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};
