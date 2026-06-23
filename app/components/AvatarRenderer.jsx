"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function AvatarRenderer({ mode = "full", emotion = "idle" }) {
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

        {/* Placeholder model until GEN‑6# is imported */}
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="#4cc9f0" />
        </mesh>

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
