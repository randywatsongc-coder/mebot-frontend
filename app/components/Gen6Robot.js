"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Gen6Robot({ bot, emotion = "idle", action = "idle" }) {
  const mountRef = useRef(null);
  const robotRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.4, 3);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight("#ffffff", 2);
    light.position.set(3, 5, 3);
    scene.add(light);

    const ambient = new THREE.AmbientLight("#555");
    scene.add(ambient);

    // Robot Body
    const bodyGeo = new THREE.BoxGeometry(1, 1.4, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: "#1e90ff",
      metalness: 0.3,
      roughness: 0.4,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.2;
    scene.add(body);

    // Robot Head
    const headGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const headMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: "#000",
      emissiveIntensity: 0.3,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.2;
    scene.add(head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const eyeMat = new THREE.MeshStandardMaterial({ color: "#00ffff" });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 2.25, 0.36);
    scene.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 2.25, 0.36);
    scene.add(rightEye);

    // Store robot parts
    robotRef.current = { body, head, leftEye, rightEye };

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Idle breathing
      body.scale.y = 1 + Math.sin(t * 2) * 0.03;

      // Head tracking (subtle)
      head.rotation.y = Math.sin(t * 0.5) * 0.2;

      // Emotion colors
      if (emotion === "happy") {
        headMat.emissive.set("#00ff88");
      } else if (emotion === "sad") {
        headMat.emissive.set("#4466ff");
      } else if (emotion === "angry") {
        headMat.emissive.set("#ff4444");
      } else {
        headMat.emissive.set("#000000");
      }

      // Actions
      if (action === "dance") {
        body.rotation.y = Math.sin(t * 4) * 0.5;
        head.rotation.x = Math.sin(t * 6) * 0.3;
      }

      if (action === "wave") {
        head.rotation.z = Math.sin(t * 8) * 0.3;
      }

      if (action === "jump") {
        const jump = Math.abs(Math.sin(t * 4)) * 0.5;
        body.position.y = 1.2 + jump;
        head.position.y = 2.2 + jump;
        leftEye.position.y = 2.25 + jump;
        rightEye.position.y = 2.25 + jump;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [emotion, action]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#000",
        borderRadius: "12px",
        overflow: "hidden",
      }}
      ref={mountRef}
    />
  );
}
