"use client";

import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="p-10">
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

        {["Jobs Matched", "Applications", "ATS Score"].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <h3 className="text-xl font-semibold">{item}</h3>
            <p className="text-gray-400 mt-2">Live AI metric</p>
          </motion.div>
        ))}

      </div>

    </div>
  );
}
