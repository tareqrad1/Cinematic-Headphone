"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/utils";

/**
 * A slow drift of fine dust particles with subtle mouse parallax — the only
 * Three.js scene on the site. Kept deliberately cheap: one BufferGeometry,
 * additive points, no post-processing.
 */
function Particles({ count = 900 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    const points = pointsRef.current;
    if (!points) return;
    points.rotation.y += delta * 0.018;
    // gentle parallax toward the pointer
    const targetX = state.pointer.x * 0.18;
    const targetY = state.pointer.y * 0.12;
    points.rotation.x += (targetY - points.rotation.x) * 0.03;
    points.position.x += (targetX - points.position.x) * 0.04;
  });

  return (
    <points ref={pointsRef} scale={[1, viewport.height / 9, 1]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#c8a45c"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function AmbientField() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [enabled, setEnabled] = useState(true);

  // Skip the scene entirely for reduced-motion users.
  useEffect(() => {
    if (prefersReducedMotion()) setEnabled(false);
  }, []);

  // Pause the render loop when the tab is hidden — no wasted GPU/CPU when the
  // user isn't looking. (The field is fixed/fullscreen, so it's always in view
  // while the tab is visible; tab visibility is the meaningful gate here.)
  useEffect(() => {
    const onVisibility = () =>
      setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 6], fov: 55 }}
        frameloop={active ? "always" : "never"}
      >
        <fog attach="fog" args={["#050506", 5, 12]} />
        <Particles />
      </Canvas>
    </div>
  );
}
