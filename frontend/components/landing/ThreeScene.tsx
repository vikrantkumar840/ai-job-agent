"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";
import GalaxyBackdrop from "./GalaxyBackdrop";
import SupernovaBurst, { SupernovaHandle } from "./SupernovaBurst";
import Laptop, { LaptopHandle } from "./Laptop";
import JourneyController from "./JourneyController";

export default function ThreeScene() {
  const laptopRef = useRef<LaptopHandle>(null);
  const supernovaRef = useRef<SupernovaHandle>(null);
  const scrollProgress = useRef(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = maxScroll > 0 ? scrollY / maxScroll : 0;
      // Debug (remove later)
      // console.log('scroll progress:', scrollProgress.current.toFixed(2));
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll); // recalc on resize
    updateScroll(); // initial value

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [20, 12, -40], fov: 45, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none", // critical: scroll passes through
      }}
    >
      <Suspense fallback={null}>
        <GalaxyBackdrop />
        <Laptop ref={laptopRef} />
        <SupernovaBurst ref={supernovaRef} />
        <JourneyController
          scrollProgress={scrollProgress}
          supernovaRef={supernovaRef}
        />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
