"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "hover" | "action">("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for weighted studio feel
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isTouch || prefersReducedMotion) return;

    setMounted(true);
    document.body.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttrElement = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorAttrElement) {
        const text = cursorAttrElement.getAttribute("data-cursor") || "";
        setCursorText(text);
        setCursorVariant("action");
        return;
      }

      const isInteractive = target.closest("a, button, [role='button'], input, select, textarea");
      if (isInteractive) {
        setCursorText("");
        setCursorVariant("hover");
      } else {
        setCursorText("");
        setCursorVariant("default");
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!mounted || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
      }}
    >
      {cursorVariant === "action" ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="bg-[#EFEBE3] text-[#0D1B16] px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase font-semibold tracking-widest shadow-2xl flex items-center justify-center whitespace-nowrap"
        >
          {cursorText}
        </motion.div>
      ) : cursorVariant === "hover" ? (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="w-10 h-10 rounded-full border border-[#EFEBE3]/60 bg-[#EFEBE3]/15 backdrop-blur-[1px]"
        />
      ) : (
        <div className="w-2.5 h-2.5 rounded-full bg-[#EFEBE3]" />
      )}
    </motion.div>
  );
}
