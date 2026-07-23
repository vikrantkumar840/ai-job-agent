"use client";

import { forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { glowTexture } from "./glowTexture";

const FRESNEL_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRESNEL_FRAGMENT = `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.2);
    vec3 color = uColor * (fresnel * uIntensity + 0.15);
    gl_FragColor = vec4(color, fresnel * 0.9 + 0.1);
  }
`;

const AIEntity = forwardRef<THREE.Group>(function AIEntity(_, ref) {
  const coreRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const fresnelMatRef = useRef<THREE.ShaderMaterial>(null);
  const glowTex = useMemo(() => glowTexture("rgba(255,150,90,1)"), []);

  const particleGeo = useMemo(() => {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 1.7 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ff5a1f") },
      uIntensity: { value: 2.2 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
      coreRef.current.rotation.x += delta * 0.15;
    }
    if (fresnelMatRef.current) {
      fresnelMatRef.current.uniforms.uIntensity.value =
        2.0 + Math.sin(state.clock.elapsedTime * 2) * 0.6;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.22;
      wireRef.current.rotation.x += delta * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.13;
      particlesRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group ref={ref}>
      {/* Soft glow halo, gives bloom something bright to grab onto */}
      <sprite scale={[2.6, 3.6, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Energy core: fresnel rim-glow shader, not a flat unlit sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.72, 3]} />
        <shaderMaterial
          ref={fresnelMatRef}
          vertexShader={FRESNEL_VERTEX}
          fragmentShader={FRESNEL_FRAGMENT}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner solid core so it doesn't look hollow head-on */}
      <mesh>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#fff4e8" transparent opacity={0.9} />
      </mesh>

      {/* Outer wireframe shell */}
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial
          color="#c3b3ff"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Orbiting particle shell */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          color="#ffb199"
          size={0.05}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <pointLight color="#ff5a1f" intensity={4} distance={8} />
    </group>
  );
});

export default AIEntity;
