"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function AvatarRenderer({ mode = "full", emotion = "idle" }) {
  return (
    <div className={`w-full ${mode === "full" ? "h-[500px]" : "h-[300px]"}`}>
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
