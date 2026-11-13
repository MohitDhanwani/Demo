"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const [counterValues, setCounterValues] = useState({
    farms: 0,
    origins: 0,
    shortcuts: 0,
    airflow: 0,
  });

  const manifestoWords = [
    { text: "We", vermilion: false },
    { text: "do", vermilion: false },
    { text: "not", vermilion: false },
    { text: "rush", vermilion: true, italic: true },
    { text: "the", vermilion: false },
    { text: "flame.", vermilion: false },
    { text: "Coffee", vermilion: false },
    { text: "is", vermilion: false },
    { text: "an", vermilion: false },
    { text: "agricultural", vermilion: false },
    { text: "artifact—shaped", vermilion: false },
    { text: "by", vermilion: false },
    { text: "high-elevation", vermilion: false },
    { text: "fog,", vermilion: false },
    { text: "mineral-rich", vermilion: false },
    { text: "volcanic", vermilion: false },
    { text: "soil,", vermilion: false },
    { text: "and", vermilion: false },
    { text: "the", vermilion: false },
    { text: "unforgiving", vermilion: false },
    { text: "patience", vermilion: true, italic: true },
    { text: "of", vermilion: false },
    { text: "generational", vermilion: false },
    { text: "producers.", vermilion: false },
    { text: "In", vermilion: false },
    { text: "our", vermilion: false },
    { text: "roasteries", vermilion: false },
    { text: "facing", vermilion: false },
    { text: "the", vermilion: false },
    { text: "Southern", vermilion: false },
    { text: "and", vermilion: false },
    { text: "Baltic", vermilion: false },
    { text: "seas,", vermilion: false },
    { text: "we", vermilion: false },
    { text: "apply", vermilion: false },
    { text: "convective", vermilion: false },
    { text: "clean-air", vermilion: false },
    { text: "heat", vermilion: false },
    { text: "to", vermilion: false },
    { text: "preserve", vermilion: false },
    { text: "crystallized", vermilion: false },
    { text: "acidity", vermilion: true, italic: true },
    { text: "and", vermilion: false },
    { text: "ethereal", vermilion: false },
    { text: "florals.", vermilion: false },
    { text: "No", vermilion: false },
    { text: "char.", vermilion: false },
    { text: "No", vermilion: false },
    { text: "clichés.", vermilion: false },
    { text: "Just", vermilion: false },
    { text: "the", vermilion: false },
    { text: "honest", vermilion: false },
    { text: "tide.", vermilion: true, italic: true },
  ];

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const words = textRef.current?.querySelectorAll(".word-scrub");
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: textRef.current,
              start: "top 75%",
              end: "bottom 35%",
              scrub: 0.8,
            },
          }
        );
      }

      // Parallax float for media elements
      const mediaCards = containerRef.current?.querySelectorAll(".parallax-media");
      mediaCards?.forEach((card, idx) => {
        const speed = (idx + 1) * 60;
        gsap.to(card, {
          y: -speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      // Animated counters
      if (counterRef.current) {
        ScrollTrigger.create({
          trigger: counterRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(
              {},
              {
                duration: 2.0,
                ease: "power2.out",
                onUpdate: function () {
                  const p = this.progress();
                  setCounterValues({
                    farms: Math.round(p * 14),
                    origins: Math.round(p * 6),
                    shortcuts: 0,
                    airflow: Math.round(p * 100),
                  });
                },
              }
            );
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={containerRef}
      className="relative w-full py-28 md:py-44 bg-[#EFEBE3] text-[#0D1B16] overflow-hidden selection:bg-[#E8472B] selection:text-[#EFEBE3]"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Editorial Subhead */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#0D1B16]/60 mb-12 md:mb-20">
          <span className="w-2.5 h-[1px] bg-[#E8472B]" />
          <span>01 / DISCIPLINED ROASTING PHILOSOPHY</span>
        </div>

        {/* Word-by-Word Opacity Scrubbed Manifesto */}
        <p
          ref={textRef}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.25] md:leading-[1.2] tracking-tight font-light text-[#0D1B16] max-w-5xl"
        >
          {manifestoWords.map((item, index) => (
            <span
              key={index}
              className={`word-scrub inline-block mr-2.5 md:mr-3.5 transition-colors ${
                item.vermilion
                  ? "text-[#E8472B] italic font-normal"
                  : "text-[#0D1B16]"
              }`}
            >
              {item.text}
            </span>
          ))}
        </p>

        {/* Floating Parallax Terroir Media Drift */}
        <div className="relative mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {/* Card 1: Farm Terroir */}
          <div className="parallax-media relative w-full h-80 rounded-sm overflow-hidden shadow-2xl border border-[#0D1B16]/10">
            <Image
              src={ASSETS.origins.ethiopia.image}
              alt="High altitude coffee terroir"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B16]/80 via-transparent to-transparent flex items-end p-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#EFEBE3]">
                YIRGACHEFFE 2,150 MASL
              </span>
            </div>
          </div>

          {/* Card 2: Roastery Lab Cooling Tray */}
          <div className="parallax-media relative w-full h-96 rounded-sm overflow-hidden shadow-2xl border border-[#0D1B16]/10 md:-translate-y-8">
            <Image
              src={ASSETS.products.espressoBlend}
              alt="Clean convective air roasting"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B16]/80 via-transparent to-transparent flex items-end p-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#EFEBE3]">
                CONVECTIVE AIR FLOW · 12-MIN ROAST
              </span>
            </div>
          </div>

          {/* Card 3: Sensory Cupping Evaluation */}
          <div className="parallax-media relative w-full h-72 rounded-sm overflow-hidden shadow-2xl border border-[#0D1B16]/10">
            <Image
              src={ASSETS.products.colombiaPink}
              alt="Sensory cupping protocol"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B16]/80 via-transparent to-transparent flex items-end p-5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#EFEBE3]">
                TRIANGULATION SENSORY CUPPING
              </span>
            </div>
          </div>
        </div>

        {/* Counter Metric Band */}
        <div
          ref={counterRef}
          className="mt-24 md:mt-32 pt-12 border-t border-[#0D1B16]/15 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-[#0D1B16]"
        >
          <div>
            <div className="font-mono text-5xl md:text-7xl font-light tracking-tighter tabular-nums">
              {String(counterValues.farms).padStart(2, "0")}
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0D1B16]/60 mt-2">
              Direct Partner Estates
            </div>
          </div>

          <div>
            <div className="font-mono text-5xl md:text-7xl font-light tracking-tighter tabular-nums">
              {String(counterValues.origins).padStart(2, "0")}
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0D1B16]/60 mt-2">
              Origin Terroirs
            </div>
          </div>

          <div>
            <div className="font-mono text-5xl md:text-7xl font-light tracking-tighter tabular-nums text-[#E8472B]">
              00
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0D1B16]/60 mt-2">
              Shortcuts Taken
            </div>
          </div>

          <div>
            <div className="font-mono text-5xl md:text-7xl font-light tracking-tighter tabular-nums">
              {counterValues.airflow}%
            </div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0D1B16]/60 mt-2">
              Convective Air Roasting
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
