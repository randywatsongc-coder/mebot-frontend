"use client";

import { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Internal component so useFrame can run
function RobotModel({ action }) {
  const speed = 0.04;

  useFrame((state) => {
    // Forward / Backward
    if (action === "move-forward") state.camera.position.z -= speed;
    if (action === "move-back") state.camera.position.z += speed;

    // Turning
    if (action === "turn-left") state.camera.rotation.y += 0.03;
    if (action === "turn-right") state.camera.rotation.y -= 0.03;

    // Camera presets
    if (action === "camera-face") {
      state.camera.position.set(0, 1.5, 1.2);
    }
    if (action === "camera-full") {
      state.camera.position.set(0, 1.5, 3);
    }
  });

  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#4cc9f0" />
    </mesh>
  );
}

export default function AvatarRenderer({ mode = "full", emotion = "idle", action = "idle" }) {
  return (
    <div
      style={{
        width: "100%",
        height: mode === "full" ? "500px" : "300px",
        background: "#0a0f24",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "20px"
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {/* GEN‑6# placeholder model */}
        <RobotModel action={action} />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
