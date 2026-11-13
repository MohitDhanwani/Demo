"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user already saw preloader in this session
    const hasSeen = sessionStorage.getItem("slow-tide-loaded");
    if (hasSeen) {
      setIsDone(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem("slow-tide-loaded", "true");
          }, 400);
          return 100;
        }
        // Organic, slightly varying step
        const jump = Math.floor(Math.random() * 8) + 2;
        return Math.min(100, prev + jump);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[10000] bg-[#0D1B16] text-[#EFEBE3] flex flex-col justify-between p-8 md:p-14 select-none pointer-events-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8472B] animate-pulse" />
              SLOW TIDE ROASTERY
            </span>
            <span>MELBOURNE · AUCKLAND · COPENHAGEN</span>
          </div>

          {/* Center Stage: Tide Rise & Counter */}
          <div className="max-w-4xl mx-auto w-full my-auto">
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-6">
              <span className="font-serif italic text-3xl md:text-5xl text-[#EFEBE3]/90">
                Patience in every batch.
              </span>
              <div className="font-mono text-6xl md:text-9xl font-light tracking-tighter text-[#EFEBE3] tabular-nums mt-4 md:mt-0">
                {String(progress).padStart(3, "0")}
                <span className="text-2xl md:text-3xl text-[#E8472B] ml-1 font-mono">%</span>
              </div>
            </div>

            {/* Tide Fill Line Container */}
            <div className="w-full h-1 bg-[#EFEBE3]/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-[#E8472B]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.1 }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] md:text-xs font-mono tracking-widest uppercase text-[#EFEBE3]/50 mt-3">
              <span>WATER · ELEVATION · TIME</span>
              <span>CALIBRATING SENSORY SPECTRUM</span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between text-[11px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 border-t border-[#EFEBE3]/10 pt-4 gap-2">
            <div>37°48'49.0"S 144°58'43.0"E</div>
            <div>FLAGSHIP EXPERIENCE 2026</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
