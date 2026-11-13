"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import BeanScene from "@/components/3d/BeanScene";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
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

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[200vh] bg-[#0D1B16] text-[#EFEBE3] select-none"
    >
      {/* Sticky Fullscreen Frame */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16 z-20"
      >
        {/* 3D Instanced Beans Canvas */}
        <BeanScene scrollProgress={scrollProgress} />

        {/* Top Technical Metadata HUD */}
        <div className="relative z-30 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-[#EFEBE3]/60 pt-16 md:pt-14">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E8472B] animate-ping" />
            <span>EST. 2021 · AIR ROASTED IN SEASIDE LABS</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span>MELBOURNE 37.81° S</span>
            <span>AUCKLAND 36.85° S</span>
            <span>COPENHAGEN 55.67° N</span>
          </div>
          <div className="font-semibold text-[#CFE0C3]">
            BATCH #042 ACTIVE
          </div>
        </div>

        {/* Center Stage: Monumental Editorial Wordmark & Headline */}
        <div className="relative z-20 my-auto text-center flex flex-col items-center justify-center">
          {/* Colossal Brand Name (Some beans float in front, some behind) */}
          <div className="relative overflow-hidden w-full">
            <h1
              className="font-serif uppercase tracking-tight text-[#EFEBE3] leading-none transition-transform duration-300"
              style={{
                fontSize: "clamp(4.2rem, 16vw, 17.5rem)",
                letterSpacing: "-0.04em",
                transform: `scale(${1 - scrollProgress * 0.15}) translateY(${-scrollProgress * 40}px)`,
                opacity: 1 - scrollProgress * 0.4,
              }}
            >
              SLOW TIDE
            </h1>
          </div>

          {/* Scrub-Revealed Headline */}
          <div
            className="max-w-3xl mx-auto mt-4 md:mt-6 transition-all duration-300"
            style={{
              opacity: Math.min(1, 0.4 + scrollProgress * 0.9),
              transform: `translateY(${20 - scrollProgress * 20}px)`,
            }}
          >
            <p className="font-serif text-2xl md:text-4xl lg:text-5xl leading-tight text-[#EFEBE3]/90 font-light">
              Coffee, roasted at the speed of the{" "}
              <span className="italic font-normal text-[#E8472B]">ocean</span>.
            </p>
            <p className="font-sans text-xs md:text-sm text-[#EFEBE3]/60 max-w-xl mx-auto mt-3 md:mt-4 leading-relaxed font-light">
              A quiet study in direct-trade terroir, cold sea air, and disciplined Nordic roasting.
              Sourced from 14 family estates. Air-shipped weekly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <MagneticButton strength={0.3} dataCursor="ACQUIRE">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#E8472B] hover:bg-[#d43c22] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-[#E8472B]/20"
                >
                  <span>Acquire Fresh Batch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </MagneticButton>

              <MagneticButton strength={0.2} dataCursor="SCROLL">
                <a
                  href="#manifesto"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-sm border border-[#EFEBE3]/20 hover:border-[#EFEBE3]/60 text-[#EFEBE3] text-xs font-mono uppercase tracking-widest transition-colors backdrop-blur-sm"
                >
                  <span>Read Manifesto</span>
                  <ArrowDown className="w-3 h-3 text-[#CFE0C3]" />
                </a>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Coordinates, Freshness Pledge & Scroll Anchor */}
        <div className="relative z-30 flex items-end justify-between text-[11px] font-mono tracking-widest uppercase text-[#EFEBE3]/50 pb-2 border-t border-[#EFEBE3]/10 pt-4">
          <div className="hidden sm:block">
            <span className="text-[#CFE0C3]">ROAST SCHEDULE:</span> MON & THU 06:00 AEST
          </div>
          <div className="flex items-center gap-2 text-center mx-auto sm:mx-0 text-[#EFEBE3]/70 animate-bounce">
            <span className="text-[10px]">SCROLL TO CONVERGE BEANS</span>
            <ArrowDown className="w-3 h-3 text-[#E8472B]" />
          </div>
          <div className="hidden sm:block text-right">
            100% COMPOSTABLE BARRIER POUCH
          </div>
        </div>
      </div>
    </section>
  );
}
