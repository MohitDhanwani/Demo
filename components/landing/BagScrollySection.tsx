"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import BagViewer3D from "@/components/3d/BagViewer3D";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight, MoveHorizontal, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BagScrollySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Determine active callout phase
  const activeStep =
    scrollProgress < 0.25 ? 0 : scrollProgress < 0.5 ? 1 : scrollProgress < 0.75 ? 2 : 3;

  return (
    <section
      id="the-bag"
      ref={containerRef}
      className="relative w-full h-[300vh] bg-[#0D1B16] text-[#EFEBE3] select-none"
    >
      {/* Sticky Fullscreen Inspection Chamber */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16 z-20"
      >
        {/* Top HUD */}
        <div className="relative z-30 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/60">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-[1px] bg-[#E8472B]" />
            <span>03 / PACKAGING ARCHITECTURE & PRESERVATION</span>
          </div>
          <div className="text-[#CFE0C3]">
            {activeStep === 3 ? "INTERACTIVE MODE: DRAG BAG" : `FEATURE 0${activeStep + 1} / 04`}
          </div>
        </div>

        {/* 3D Bag Model in Center Canvas */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
          data-cursor={activeStep === 3 ? "DRAG 360°" : "EXPLORE"}
        >
          <BagViewer3D scrollProgress={scrollProgress} interactive={true} />
        </div>

        {/* Synchronized Scrollytelling Callout Overlays */}
        <div className="relative z-20 pointer-events-none max-w-7xl mx-auto w-full my-auto flex items-center justify-between px-4">
          {/* Left Side Callout Container */}
          <div className="w-full max-w-sm">
            {activeStep === 0 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
                  01 / FORM & MATERIAL
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#EFEBE3]">
                  The 250g Vessel.
                </h3>
                <p className="text-xs font-sans text-[#EFEBE3]/70 leading-relaxed font-light">
                  Form follows freshness. A rigid gusseted profile finished with matte UV-blocking ink-green surface protection, shielding fragile aromatic volatile compounds from ambient photo-oxidation.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#CFE0C3]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>UV LIGHT BARRIER: 99.8% BLOCK</span>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
                  03 / COMPOSTABLE SCIENCE
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#EFEBE3]">
                  Zero Foil. Zero Plastics.
                </h3>
                <p className="text-xs font-sans text-[#EFEBE3]/70 leading-relaxed font-light">
                  Constructed from certified industrially and home-compostable plant starch and unbleached FSC paper. Decomposes into nutrient-rich organic biomass within 180 days.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#CFE0C3]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>EN 13432 CERTIFIED COMPOSTABLE</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Callout Container */}
          <div className="w-full max-w-sm text-right flex flex-col items-end">
            {activeStep === 1 && (
              <div className="space-y-3 animate-fadeIn text-right flex flex-col items-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
                  02 / DEGASSING TECH
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#EFEBE3]">
                  One-Way Degassing Valve.
                </h3>
                <p className="text-xs font-sans text-[#EFEBE3]/70 leading-relaxed font-light text-right">
                  Freshly roasted beans release heavy volumes of carbon dioxide. Our ultrasonic valve vents internal pressure continuously while creating an impenetrable vacuum against exterior oxygen.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#CFE0C3]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ONE-WAY MICRO-MEMBRANE</span>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4 animate-fadeIn text-right flex flex-col items-end pointer-events-auto">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
                  04 / HAND STAMPED FRESHNESS
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#EFEBE3]">
                  Inspect Every Angle.
                </h3>
                <p className="text-xs font-sans text-[#EFEBE3]/70 leading-relaxed font-light text-right">
                  Drag the bag to spin 360°. Every pouch is sealed, numbered, and stamped by hand at our roasteries prior to global air dispatch.
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-[#CFE0C3] pb-2">
                  <MoveHorizontal className="w-4 h-4 animate-pulse" />
                  <span>CLICK & DRAG TO ROTATE 360°</span>
                </div>

                <MagneticButton strength={0.3} dataCursor="SHOP BAGS">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-xl"
                  >
                    <span>Acquire The 250g Vessel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </MagneticButton>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status Track */}
        <div className="relative z-30 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 border-t border-[#EFEBE3]/10 pt-4">
          <div className="flex items-center gap-4">
            <span className={activeStep === 0 ? "text-[#E8472B]" : ""}>01 FORM</span>
            <span>·</span>
            <span className={activeStep === 1 ? "text-[#E8472B]" : ""}>02 VALVE</span>
            <span>·</span>
            <span className={activeStep === 2 ? "text-[#E8472B]" : ""}>03 LINER</span>
            <span>·</span>
            <span className={activeStep === 3 ? "text-[#E8472B]" : ""}>04 360° INSPECT</span>
          </div>

          <div className="w-48 h-1 bg-[#EFEBE3]/10 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-[#E8472B] transition-all duration-100"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
