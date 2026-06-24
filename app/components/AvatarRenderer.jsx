"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { subscribeToAvatarEvents } from "@/app/events/avatarEvents";

// Placeholder robot model until GEN‑6# is imported
function RobotModel({ action, emotion, gesture }, ref) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;

    // Idle breathing
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;

    // Gestures
    if (gesture === "wave") {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.3;
    }
    if (gesture === "nod") {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 6) * 0.2;
    }
    if (gesture === "thumbs-up") {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2;
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

    meshRef.current.material.color.set(emoColors[emotion] || "#4cc9f0");
  });

  // Expose animation functions to parent
  if (ref) {
    ref.current = {
      playDance: () => {
        meshRef.current.rotation.x = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = 0;
      },
      playWave: () => {},
      playJump: () => {},
      setEmotion: (emo) => {},
      changeScene: (scene) => {}
    };
  }

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#4cc9f0" />
    </mesh>
  );
}

const ForwardRobot = React.forwardRef(RobotModel);

export default function AvatarRenderer({
  mode = "full",
  emotion = "idle",
  action = "idle",
  gesture = "none",
  scene = "studio"
}) {
  const avatarRef = useRef();

  // Scene backgrounds
  const sceneColors = {
    studio: "#0a0f24",
    neon: "#1a0033",
    room: "#1f1f1f",
    dark: "#000000"
  };

  // Listen for chat → avatar events
  useEffect(() => {
    const unsubscribe = subscribeToAvatarEvents((event) => {
      if (!avatarRef.current) return;

      if (event.type === "dance") avatarRef.current.playDance();
      if (event.type === "wave") avatarRef.current.playWave();
      if (event.type === "jump") avatarRef.current.playJump();
      if (event.type === "emotion") avatarRef.current.setEmotion(event.value);
      if (event.type === "scene") avatarRef.current.changeScene(event.value);
    });

    return unsubscribe;
  }, []);

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

        <ForwardRobot
          ref={avatarRef}
          action={action}
          emotion={emotion}
          gesture={gesture}
        />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
