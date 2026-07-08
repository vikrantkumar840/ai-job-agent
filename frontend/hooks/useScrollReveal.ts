"use client";

import { useRef } from "react";
import {
  useInView,
  useAnimation,
} from "framer-motion";
import { useEffect } from "react";

export default function useScrollReveal() {
  const ref = useRef(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.2,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return {
    ref,
    controls,
  };
}
