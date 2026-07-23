"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { SupernovaHandle } from "./SupernovaBurst";

interface Props {
  scrollProgress: React.MutableRefObject<number>;
  supernovaRef: React.RefObject<SupernovaHandle>;
}

export default function JourneyController({ scrollProgress, supernovaRef }: Props) {
  const { camera } = useThree();
  // Remember the last progress value so we can detect crossing the threshold
  const prevProgress = useRef(0);

  useFrame(() => {
    const t = scrollProgress?.current ?? 0;

    // Camera interpolation – continuously follows the scroll
    const pos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(20, 12, -40),
      new THREE.Vector3(0, 1.0, 2.8),
      t
    );
    camera.position.copy(pos);
    camera.lookAt(0, 0.6, 0);

    // Trigger supernova when scrolling **past** 0.3 (crossing from below to above)
    if (prevProgress.current <= 0.3 && t > 0.3 && supernovaRef?.current) {
      supernovaRef.current.trigger(new THREE.Vector3(0, 1.5, -1.5));
    }

    // Store current progress for the next frame
    prevProgress.current = t;
  });

  return null;
}
