"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  Helper to create a realistic galaxy‑disk gradient                 */
/*  Uses colours sampled from real spiral galaxies                    */
/* ------------------------------------------------------------------ */
function createGalaxyDiskTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  // Inner – hot core (gold/orange)
  gradient.addColorStop(0, "#fbbf24");
  // Dust lanes – warm brown
  gradient.addColorStop(0.15, "#b45309");
  // Star‑forming regions – magenta/pink
  gradient.addColorStop(0.35, "#db2777");
  // Main spiral – cool blue/cyan
  gradient.addColorStop(0.6, "#06b6d4");
  // Outer halo – deep indigo
  gradient.addColorStop(0.85, "#312e81");
  gradient.addColorStop(1, "#0b0b1a");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

/* Radial glow sprite for the black hole’s soft halo */
function createGlowTexture(
  inner: string,
  outer: string,
  size = 256
): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.5, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function BlackHole() {
  const diskRef1 = useRef<THREE.Mesh>(null);
  const diskRef2 = useRef<THREE.Mesh>(null);
  const diskRef3 = useRef<THREE.Mesh>(null);

  const galaxyDiskTex = useMemo(() => createGalaxyDiskTexture(), []);
  const glowTex = useMemo(
    () => createGlowTexture("rgba(255,180,80,0.8)", "rgba(150,50,200,0.3)"),
    []
  );

  useFrame((_, delta) => {
    if (diskRef1.current) diskRef1.current.rotation.z += delta * 0.03;
    if (diskRef2.current) diskRef2.current.rotation.z -= delta * 0.05;
    if (diskRef3.current) diskRef3.current.rotation.z += delta * 0.02;
  });

  return (
    <group position={[26, 10, -60]} rotation={[1.15, 0.25, 0.35]}>
      {/* Event horizon – black sphere, no light escapes */}
      <mesh renderOrder={1}>
        <sphereGeometry args={[3.6, 64, 64]} />
        <meshBasicMaterial color="#000000" depthWrite />
      </mesh>

      {/* Main accretion disk – multi‑colour, high detail */}
      <mesh ref={diskRef1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.9, 6.0, 256]} />
        <meshBasicMaterial
          map={galaxyDiskTex}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Thin inner hot ring */}
      <mesh ref={diskRef3} rotation={[Math.PI / 2 - 0.08, 0, 0]}>
        <ringGeometry args={[3.55, 4.2, 128]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Second warped ring for depth */}
      <mesh ref={diskRef2} rotation={[Math.PI / 2 + 0.18, 0, 0]}>
        <ringGeometry args={[4.1, 5.3, 256]} />
        <meshBasicMaterial
          map={galaxyDiskTex}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Huge atmospheric glow */}
      <sprite scale={[15, 15, 1]} renderOrder={0}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Warm + cool point lights */}
      <pointLight color="#ffb050" intensity={7} distance={40} />
      <pointLight color="#8b5cf6" intensity={4} distance={45} position={[2, 1, 4]} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Distant nebula clouds (like Hubble’s Pillars of Creation)         */
/* ------------------------------------------------------------------ */
function DistantNebula() {
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(60,20,80,0.7)");
    g.addColorStop(0.4, "rgba(20,10,50,0.4)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <>
      <sprite position={[-45, 14, -90]} scale={[70, 35, 1]}>
        <spriteMaterial map={tex} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[55, -10, -110]} scale={[65, 30, 1]}>
        <spriteMaterial map={tex} color={new THREE.Color("#06b6d4")} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </>
  );
}

export default function GalaxyBackdrop() {
  return (
    <>
      <color attach="background" args={["#05030a"]} />
      <fog attach="fog" args={["#0a0614", 35, 150]} />
      <ambientLight intensity={0.15} />
      <Stars radius={150} depth={120} count={6000} factor={4.5} saturation={0.2} fade speed={0.8} />
      <BlackHole />
      <DistantNebula />
    </>
  );
}
