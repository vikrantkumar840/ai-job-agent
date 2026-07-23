"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas } from "@react-three/fiber";
import { Environment, PerformanceMonitor } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

import GalaxyBackdrop from "./GalaxyBackdrop";
import AIEntity from "./AIEntity";
import Laptop, { type LaptopHandle } from "./Laptop";
import JourneyController from "./JourneyController";
import SupernovaBurst, { type SupernovaHandle } from "./SupernovaBurst";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function AIJourney() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false); // desktop + motion allowed
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [showButton, setShowButton] = useState(false);
  const [merged, setMerged] = useState(false);
  const [copyVisible, setCopyVisible] = useState(true);

  const progressRef = useRef(0);
  const aiRef = useRef<THREE.Group | null>(null);
  const laptopRef = useRef<LaptopHandle | null>(null);
  const supernovaRef = useRef<SupernovaHandle | null>(null);
  const mergingRef = useRef(false);

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    function evaluate() {
      setReady(desktopMq.matches && !reducedMq.matches);
    }
    evaluate();
    // Live-updating, not a one-time snapshot — a mid-session OS motion
    // preference change (or window resize past the breakpoint) should
    // actually take effect instead of being locked in at first render.
    desktopMq.addEventListener("change", evaluate);
    reducedMq.addEventListener("change", evaluate);

    // Detect a software-rendered / weak GPU (very common on cloud/VM
    // instances without a dedicated GPU — Chromium falls back to
    // SwiftShader or llvmpipe) and skip the expensive effects stack
    // entirely rather than let it lag. This is a real capability check,
    // not a heuristic guess.
    try {
      const testCanvas = document.createElement("canvas");
      const gl = (testCanvas.getContext("webgl2") ||
        testCanvas.getContext("webgl")) as WebGLRenderingContext | null;
      const dbgInfo = gl?.getExtension("WEBGL_debug_renderer_info");
      const renderer = dbgInfo
        ? (gl!.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL) as string)
        : "";
      if (/swiftshader|llvmpipe|software|angle \(.*, .*, opengl/i.test(renderer)) {
        setQuality("low");
      }
    } catch {
      // If we can't even probe WebGL, err toward the cheaper path.
      setQuality("low");
    }

    return () => {
      desktopMq.removeEventListener("change", evaluate);
      reducedMq.removeEventListener("change", evaluate);
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=3200",
        pin: true,
        scrub: 0.7,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          setCopyVisible(self.progress < 0.12);
          setShowButton(self.progress > 0.9 && !mergingRef.current);
        },
      });

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready]);

  function handleStartAI() {
    if (mergingRef.current || !aiRef.current) return;
    mergingRef.current = true;
    setShowButton(false);

    const pos = aiRef.current.position.clone();
    supernovaRef.current?.trigger(pos);

    gsap.to(aiRef.current.scale, {
      x: 0.01,
      y: 0.01,
      z: 0.01,
      duration: 0.6,
      ease: "power3.in",
    });

    if (laptopRef.current?.screenMaterial) {
      gsap.to(laptopRef.current.screenMaterial, {
        emissiveIntensity: 3.5,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
      });
    }

    setTimeout(() => {
      setMerged(true);
      document
        .getElementById("pipeline")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 1400);
  }

  // Reduced-motion / mobile: honest static fallback, no 3D, no scroll-jack
  if (!ready) {
    return (
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
        <div className="grid-field absolute inset-0 opacity-40" />
        <p className="relative font-mono text-xs uppercase tracking-[0.3em] text-signal">
          ResuApply
        </p>
        <h1 className="text-balance relative mt-4 max-w-2xl font-display text-4xl font-bold sm:text-5xl">
          Your resume, run by <span className="text-gradient">eight AI agents</span>.
        </h1>
        <p className="relative mt-5 max-w-lg text-paper-dim">
          Upload your resume as a PDF and let the pipeline take it from
          there.
        </p>
        <MagneticButton
          className="relative mt-8"
          onClick={() => router.push("/workflow")}
        >
          Start the pipeline
        </MagneticButton>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-ink">
      <Canvas
        dpr={quality === "high" ? [1, 1.5] : 1}
        gl={{
          antialias: quality === "high",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        camera={{ position: [0, 0.5, 9], fov: 45 }}
        className="!absolute inset-0"
      >
        <PerformanceMonitor
          onDecline={() => setQuality("low")}
          flipflops={2}
        />

        <GalaxyBackdrop />
        {quality === "high" && (
          <Environment preset="night" environmentIntensity={0.25} />
        )}
        <directionalLight position={[3, 4, 5]} intensity={1.1} color="#fff4e8" />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#8b6bff" />

        <AIEntity ref={aiRef} />
        <Laptop ref={laptopRef} />
        <SupernovaBurst ref={supernovaRef} />

        <JourneyController
          progressRef={progressRef}
          aiRef={aiRef}
          laptopRef={laptopRef}
          merging={mergingRef}
        />

        {quality === "high" && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.85}
              luminanceThreshold={0.22}
              luminanceSmoothing={0.35}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={0.7} />
          </EffectComposer>
        )}
      </Canvas>

      {/* Intro copy, fades out as the journey begins */}
      <AnimatePresence>
        {copyVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute inset-x-0 top-[14%] flex flex-col items-center px-6 text-center"
          >
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
              ResuApply
            </p>
            <h1 className="text-balance mt-4 max-w-2xl font-display text-4xl font-bold sm:text-6xl">
              Your resume, run by{" "}
              <span className="text-gradient">eight AI agents</span>.
            </h1>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-paper-dim/50">
              scroll to begin
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start AI button, appears once the AI has reached the laptop */}
      <AnimatePresence>
        {showButton && !merged && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="absolute inset-x-0 bottom-[14%] flex justify-center"
          >
            <MagneticButton onClick={handleStartAI}>
              Start AI
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {merged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-3"
          >
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-ok">
              agent online
            </p>
            <MagneticButton onClick={() => router.push("/workflow")}>
              Start the pipeline
            </MagneticButton>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() =>
          document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute right-6 top-6 z-10 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-dim/40 transition hover:text-signal"
      >
        Skip intro ↓
      </button>
    </section>
  );
}
