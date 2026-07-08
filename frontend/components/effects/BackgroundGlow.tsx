"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {

  return (

    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      <motion.div

        animate={{
          x: [-120, 100, -120],
          y: [-80, 70, -80],
        }}

        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}

        className="
        absolute
        left-[-250px]
        top-[-250px]
        h-[900px]
        w-[900px]
        rounded-full
        bg-cyan-500/25
        blur-[180px]
        will-change-transform
        "

      />

      <motion.div

        animate={{
          x: [120, -80, 120],
          y: [60, -100, 60],
        }}

        transition={{
          duration: 34,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}

        className="
        absolute
        right-[-250px]
        bottom-[-250px]
        h-[850px]
        w-[850px]
        rounded-full
        bg-emerald-500/20
        blur-[180px]
        will-change-transform
        "

      />

    </div>

  );

}
