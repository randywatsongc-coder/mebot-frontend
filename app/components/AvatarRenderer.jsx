"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Placeholder robot model until GEN‑6# is imported
function RobotModel({ action, emotion, gesture }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    // Basic idle breathing animation
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;

    // Gestures
    if (gesture === "wave") {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.3;
    }
    if (gesture === "nod") {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 6) * 0.2;
    }
    if (gesture === "thumbs-up") {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }

    // Emotion color tint
    const emoColors = {
      idle: "#4cc9f0",
      happy: "#4ef08a",
      thinking: "#f0e14c",
      excited: "#ff6b6b",
      focused: "#6b9bff",
      sad: "#6c6c6c"
    };

    ref.current.material.color.set(emoColors[emotion] || "#4cc9f0");
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#4cc9f0" />
    </mesh>
  );
}

export default function AvatarRenderer({
  mode = "full",
  emotion = "idle",
  action = "idle",
  gesture = "none",
  scene = "studio"
}) {
  // Scene backgrounds
  const sceneColors = {
    studio: "#0a0f24",
    neon: "#1a0033",
    room: "#1f1f1f",
    dark: "#000000"
  };

  return (
    <div
      style={{
        width: "100%",
        height: mode === "full" ? "500px" : "300px",
        background: sceneColors[scene] || "#0a0f24",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "20px"
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <RobotModel action={action} emotion={emotion} gesture={gesture} />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
