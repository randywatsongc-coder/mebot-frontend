"use client";

import { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { subscribeToAvatarEvents } from "@/app/events/avatarEvents";
import Gen6Robot from "@/app/components/Gen6Robot";

export default function AvatarRenderer({
  mode = "full",
  emotion = "idle",
  action = "idle",
  scene = "studio",
}) {
  const avatarState = useRef({
    emotion: emotion,
    action: action,
    scene: scene,
  });

  // Scene backgrounds
  const sceneColors = {
    studio: "#0a0f24",
    neon: "#1a0033",
    room: "#1f1f1f",
    dark: "#000000",
  };

  // Listen for chat → avatar events
  useEffect(() => {
    const unsubscribe = subscribeToAvatarEvents((event) => {
      if (!event) return;

      if (event.type === "emotion") {
        avatarState.current.emotion = event.value;
      }
      if (event.type === "dance") {
        avatarState.current.action = "dance";
      }
      if (event.type === "wave") {
        avatarState.current.action = "wave";
      }
      if (event.type === "jump") {
        avatarState.current.action = "jump";
      }
      if (event.type === "scene") {
        avatarState.current.scene = event.value;
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: mode === "full" ? "500px" : "300px",
        background: sceneColors[avatarState.current.scene] || "#0a0f24",
        borderRadius: "12px",
        overflow: "hidden",
        marginBottom: "20px",
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <Gen6Robot
          emotion={avatarState.current.emotion}
          action={avatarState.current.action}
        />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
