"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { screenUITexture } from "./screenUITexture";

export type LaptopHandle = {
  group: THREE.Group | null;
  lid: THREE.Group | null;
  screenMaterial: THREE.MeshStandardMaterial | null;
};

const Laptop = forwardRef<LaptopHandle>(function Laptop(_, ref) {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const uiTexture = useMemo(() => screenUITexture(), []);

  useImperativeHandle(ref, () => ({
    get group() { return groupRef.current; },
    get lid() { return lidRef.current; },
    get screenMaterial() { return screenMatRef.current; },
  }));

  return (
    <group ref={groupRef}>
      {/* Soft fill light – neutral, no colour cast */}
      <pointLight position={[0, 1.5, 1.8]} intensity={1.8} distance={6} color="#eef1f8" />

      {/* Keyboard backlight glow (dim) – will be animated externally */}
      <pointLight position={[0, 0.06, 0.2]} intensity={0.3} distance={1.2} color="#ff5a1f" />

      {/* Base deck */}
      <RoundedBox args={[2.6, 0.1, 1.7]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1d26" metalness={0.45} roughness={0.5} />
      </RoundedBox>

      {/* Keyboard inset (dark, matte) */}
      <mesh position={[0, 0.056, 0.05]}>
        <boxGeometry args={[2.28, 0.008, 1.28]} />
        <meshStandardMaterial color="#0a0c10" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Lid group – pivots from hinge */}
      <group ref={lidRef} position={[0, 0.055, -0.79]} rotation={[Math.PI / 2, 0, 0]}>
        <RoundedBox args={[2.6, 1.7, 0.07]} radius={0.06} smoothness={4} position={[0, 0.85, 0.03]}>
          <meshStandardMaterial color="#1a1d26" metalness={0.45} roughness={0.5} />
        </RoundedBox>

        {/* Lid logo glow */}
        <mesh position={[0, 0.85, -0.002]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.11, 32]} />
          <meshStandardMaterial color="#ff5a1f" emissive="#ff5a1f" emissiveIntensity={0.2} />
        </mesh>

        {/* Screen bezel */}
        <mesh position={[0, 0.85, 0.075]}>
          <planeGeometry args={[2.4, 1.5]} />
          <meshStandardMaterial color="#020203" metalness={0.15} roughness={0.6} />
        </mesh>

        {/* Screen – emissive dashboard */}
        <mesh position={[0, 0.85, 0.082]}>
          <planeGeometry args={[2.16, 1.3]} />
          <meshStandardMaterial
            ref={screenMatRef}
            map={uiTexture}
            emissive={new THREE.Color("#ffffff")}
            emissiveMap={uiTexture}
            emissiveIntensity={0.05}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
});

export default Laptop;
