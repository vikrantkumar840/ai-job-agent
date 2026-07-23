"use client";

import { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type SupernovaHandle = {
  trigger: (position: THREE.Vector3) => void;
};

// Particle counts for each layer
const SPARK_COUNT = 600;
const SMOKE_COUNT = 200;
const GAS_COUNT = 400;

// Canvas‑generated smoke sprite texture (semi‑transparent blob)
function createSmokeTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.3, "rgba(200,100,255,0.7)");
  g.addColorStop(0.7, "rgba(100,50,200,0.3)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

const SupernovaBurst = forwardRef<SupernovaHandle>(function SupernovaBurst(_, ref) {
  // --- Spark layer (fast streaks) ---
  const sparkGeo = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3);
    const colors = new Float32Array(SPARK_COUNT * 3);
    const palette = ["#ff5a1f", "#ffb199", "#c3b3ff", "#3fd1a8", "#ffffff"];
    for (let i = 0; i < SPARK_COUNT; i++) {
      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // --- Smoke layer (billowing soft clouds) ---
  const smokeGeo = useMemo(() => {
    const positions = new Float32Array(SMOKE_COUNT * 3);
    const colors = new Float32Array(SMOKE_COUNT * 3);
    for (let i = 0; i < SMOKE_COUNT; i++) {
      // smoke colours: deep purples, oranges, cyans
      const c = new THREE.Color().setHSL(0.7 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.4);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // --- Gas filaments (long, wispy trails) ---
  const gasGeo = useMemo(() => {
    const positions = new Float32Array(GAS_COUNT * 3);
    const colors = new Float32Array(GAS_COUNT * 3);
    for (let i = 0; i < GAS_COUNT; i++) {
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.9, 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Material refs
  const sparkMatRef = useRef<THREE.PointsMaterial>(null);
  const smokeMatRef = useRef<THREE.PointsMaterial>(null);
  const gasMatRef = useRef<THREE.PointsMaterial>(null);
  const flashRef = useRef<THREE.Mesh>(null);

  // Active state
  const active = useRef(false);
  const startTime = useRef(0);
  const origin = useRef(new THREE.Vector3());

  // Store pre‑calculated velocities for each layer
  const sparkVel = useRef(new Float32Array(SPARK_COUNT * 3)).current;
  const smokeVel = useRef(new Float32Array(SMOKE_COUNT * 3)).current;
  const gasVel = useRef(new Float32Array(GAS_COUNT * 3)).current;

  // Initialize velocities once (will be recalculated per trigger for direction randomness)
  function randomVel(count: number, speedMin: number, speedMax: number) {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      vel[i * 3] = dir.x * speed;
      vel[i * 3 + 1] = dir.y * speed;
      vel[i * 3 + 2] = dir.z * speed;
    }
    return vel;
  }

  useImperativeHandle(ref, () => ({
    trigger(position: THREE.Vector3) {
      active.current = true;
      startTime.current = performance.now();
      origin.current.copy(position);

      // Recalculate velocities for each layer
      const newSpark = randomVel(SPARK_COUNT, 4, 10);
      const newSmoke = randomVel(SMOKE_COUNT, 0.8, 2.5);
      const newGas = randomVel(GAS_COUNT, 1.2, 4.0);
      sparkVel.set(newSpark);
      smokeVel.set(newSmoke);
      gasVel.set(newGas);

      // Reset positions to origin
      const sparkPos = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
      const smokePos = smokeGeo.getAttribute("position") as THREE.BufferAttribute;
      const gasPos = gasGeo.getAttribute("position") as THREE.BufferAttribute;
      for (let i = 0; i < SPARK_COUNT; i++) sparkPos.setXYZ(i, position.x, position.y, position.z);
      for (let i = 0; i < SMOKE_COUNT; i++) smokePos.setXYZ(i, position.x, position.y, position.z);
      for (let i = 0; i < GAS_COUNT; i++) gasPos.setXYZ(i, position.x, position.y, position.z);
      sparkPos.needsUpdate = smokePos.needsUpdate = gasPos.needsUpdate = true;

      // Reset opacities
      if (sparkMatRef.current) sparkMatRef.current.opacity = 1;
      if (smokeMatRef.current) smokeMatRef.current.opacity = 0.8;
      if (gasMatRef.current) gasMatRef.current.opacity = 0.6;

      // Flash sphere
      if (flashRef.current) {
        flashRef.current.position.copy(position);
        flashRef.current.scale.setScalar(0.05);
        (flashRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
      }
    },
  }));

  const smokeTex = useMemo(() => createSmokeTexture(), []);

  useFrame(() => {
    if (!active.current) return;
    const elapsed = (performance.now() - startTime.current) / 1000;
    const life = 2.2; // total explosion duration

    if (elapsed > life) {
      active.current = false;
      return;
    }

    const t = elapsed / life;

    // Update spark positions (fast, fading early)
    const sparkPos = sparkGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparkPos.setXYZ(
        i,
        origin.current.x + sparkVel[i * 3] * elapsed,
        origin.current.y + sparkVel[i * 3 + 1] * elapsed,
        origin.current.z + sparkVel[i * 3 + 2] * elapsed
      );
    }
    sparkPos.needsUpdate = true;
    if (sparkMatRef.current) sparkMatRef.current.opacity = Math.max(0, 1 - t * 2); // fade out quickly

    // Smoke – expands slowly, with turbulent swirl
    const smokePos = smokeGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const x = origin.current.x + smokeVel[i * 3] * elapsed + Math.sin(elapsed * 5 + i) * 0.2;
      const y = origin.current.y + smokeVel[i * 3 + 1] * elapsed + Math.cos(elapsed * 4 + i) * 0.2;
      const z = origin.current.z + smokeVel[i * 3 + 2] * elapsed;
      smokePos.setXYZ(i, x, y, z);
    }
    smokePos.needsUpdate = true;
    if (smokeMatRef.current) smokeMatRef.current.opacity = Math.max(0, 0.8 * (1 - t));

    // Gas filaments – longer trails, wavy motion
    const gasPos = gasGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < GAS_COUNT; i++) {
      const wave = Math.sin(elapsed * 3 + i * 0.5) * 0.6;
      const x = origin.current.x + gasVel[i * 3] * elapsed + wave;
      const y = origin.current.y + gasVel[i * 3 + 1] * elapsed + Math.cos(elapsed * 2.5 + i) * 0.4;
      const z = origin.current.z + gasVel[i * 3 + 2] * elapsed;
      gasPos.setXYZ(i, x, y, z);
    }
    gasPos.needsUpdate = true;
    if (gasMatRef.current) gasMatRef.current.opacity = Math.max(0, 0.6 * (1 - t));

    // Central flash
    if (flashRef.current) {
      const flashMat = flashRef.current.material as THREE.MeshBasicMaterial;
      const flashDuration = 0.6;
      const ft = Math.min(1, elapsed / flashDuration);
      flashRef.current.scale.setScalar(0.05 + ft * 8);
      flashMat.opacity = Math.max(0, 1 - ft);
    }
  });

  return (
    <group>
      {/* Sparks – sharp, fast points */}
      <points geometry={sparkGeo}>
        <pointsMaterial
          ref={sparkMatRef}
          size={0.06}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Smoke clouds – uses custom texture for soft look */}
      <points geometry={smokeGeo}>
        <pointsMaterial
          ref={smokeMatRef}
          map={smokeTex}
          size={0.45}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.NormalBlending}
          alphaTest={0.01}
        />
      </points>

      {/* Gas filaments – wispy, slightly larger */}
      <points geometry={gasGeo}>
        <pointsMaterial
          ref={gasMatRef}
          size={0.25}
          vertexColors
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Flash sphere */}
      <mesh ref={flashRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#fff4e8"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
});

export default SupernovaBurst;
