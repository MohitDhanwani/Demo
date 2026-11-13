"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/assets";
import { Sliders, Clock, Thermometer, Scale, Sparkles, Check } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  title: string;
  time: string;
  action: string;
  details: string;
  image: string;
}

const RITUAL_STEPS: Step[] = [
  {
    number: "01",
    title: "Grind with Precision",
    time: "0:00",
    action: "Medium-Fine / 600–700 Microns",
    details:
      "Avoid boulders and excess fines. Single-dose 15 grams of whole bean coffee through flat burrs for unimodal particle distribution. Aroma should be vibrant, floral, and sweet.",
    image: ASSETS.ritual.grind,
  },
  {
    number: "02",
    title: "The Awakening Bloom",
    time: "0:00 – 0:45",
    action: "50g Water @ 93°C · 45s Saturation",
    details:
      "Introduce 50 grams of soft water (30–60 ppm). Gently swirl the slurry twice to ensure zero dry pockets. Watch the coffee bed dome and release trapped roasting carbon dioxide.",
    image: ASSETS.ritual.bloom,
  },
  {
    number: "03",
    title: "Centric Spiral Pour",
    time: "0:45 – 1:30",
    action: "Continuous Concentric Stream to 150g",
    details:
      "Pour with a steady low-flow gooseneck kettle. Maintain a low pour height to prevent turbulent heat loss. Spiral gently from center outwards without washing the paper filter walls.",
    image: ASSETS.ritual.pour,
  },
  {
    number: "04",
    title: "Final Pulse & Drawdown",
    time: "1:30 – 2:45",
    action: "Final Draw to 250g Total Water",
    details:
      "Complete final pulse to reach 250g. Give one gentle circular tap. The bed should settle into a flat, smooth plane of uniform grounds as the golden amber liquid draws through.",
    image: ASSETS.ritual.wait,
  },
  {
    number: "05",
    title: "Rest & Taste",
    time: "Ready @ 60°C",
    action: "Serve in Thin Ceramic Carafe",
    details:
      "Do not drink piping hot. Specialty coffee peaks as it cools between 55°C and 62°C, where complex fruit esters, malic apple acidity, and jasmine sweetness fully unlock.",
    image: ASSETS.ritual.drink,
  },
];

export default function RitualSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Brew Ratio Calculator State
  const [cups, setCups] = useState(1);
  const [strength, setStrength] = useState<"mellow" | "balanced" | "intense">("balanced");

  const ratioMultipliers = {
    mellow: 17,
    balanced: 16,
    intense: 15,
  };

  const coffeeGramsPerCup = 15;
  const totalCoffeeGrams = cups * coffeeGramsPerCup;
  const totalWaterMl = totalCoffeeGrams * ratioMultipliers[strength];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const index = Math.min(
            RITUAL_STEPS.length - 1,
            Math.floor(self.progress * RITUAL_STEPS.length)
          );
          setActiveStep(index);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="the-ritual"
      ref={containerRef}
      className="relative w-full h-[320vh] bg-[#EFEBE3] text-[#0D1B16] select-none"
    >
      {/* Sticky Split Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16 z-20">
        {/* Top Section Header */}
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#0D1B16]/60 border-b border-[#0D1B16]/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-[1px] bg-[#E8472B]" />
            <span>04 / THE FIVE-STEP POUR-OVER PROTOCOL</span>
          </div>
          <div className="font-semibold text-[#0D1B16]">
            STEP 0{activeStep + 1} / 05
          </div>
        </div>

        {/* Center Split Screen: Left Stepper vs Right Cinematics */}
        <div className="my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Numbered Active Step Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-4 text-sm font-mono text-[#E8472B]">
              <span className="font-mono text-2xl font-light">
                {RITUAL_STEPS[activeStep].number}
              </span>
              <span className="w-8 h-[1px] bg-[#E8472B]" />
              <div className="flex items-center gap-1.5 uppercase tracking-widest text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{RITUAL_STEPS[activeStep].time}</span>
              </div>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none text-[#0D1B16]">
              {RITUAL_STEPS[activeStep].title}
            </h2>

            <div className="inline-block px-3.5 py-1.5 rounded-sm bg-[#0D1B16] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest">
              {RITUAL_STEPS[activeStep].action}
            </div>

            <p className="text-sm md:text-base font-sans text-[#0D1B16]/75 leading-relaxed font-light max-w-xl">
              {RITUAL_STEPS[activeStep].details}
            </p>

            {/* Step Indicators Rail */}
            <div className="flex items-center gap-3 pt-4">
              {RITUAL_STEPS.map((step, idx) => (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeStep
                      ? "w-12 bg-[#E8472B]"
                      : idx < activeStep
                      ? "w-6 bg-[#0D1B16]/60"
                      : "w-4 bg-[#0D1B16]/15"
                  }`}
                  aria-label={`Go to step ${step.number}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Masked Synchronized Pour-Over Cinematic Video/Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full h-80 sm:h-96 lg:h-[460px] rounded-sm overflow-hidden shadow-2xl border border-[#0D1B16]/15">
              <Image
                src={RITUAL_STEPS[activeStep].image}
                alt={RITUAL_STEPS[activeStep].title}
                fill
                className="object-cover transition-all duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B16]/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-[11px] font-mono uppercase tracking-widest text-[#EFEBE3] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E8472B] animate-pulse" />
                  <span>PHASE: {RITUAL_STEPS[activeStep].action}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Brew-Ratio Calculator Widget */}
        <div className="border-t border-[#0D1B16]/15 pt-4">
          <div className="bg-[#E5E0D6] rounded-sm p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#0D1B16]">
              <Scale className="w-4 h-4 text-[#E8472B]" />
              <span className="font-semibold">Interactive Ratio Calculator:</span>
            </div>

            {/* Cups Stepper */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#0D1B16]/60 uppercase">Volume:</span>
              {[1, 2, 3, 4].map((c) => (
                <button
                  key={c}
                  onClick={() => setCups(c)}
                  className={`w-7 h-7 rounded-sm flex items-center justify-center font-medium transition-colors ${
                    cups === c
                      ? "bg-[#0D1B16] text-[#EFEBE3]"
                      : "bg-[#EFEBE3] text-[#0D1B16] hover:bg-[#D7D1C3]"
                  }`}
                >
                  {c}C
                </button>
              ))}
            </div>

            {/* Strength Switcher */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#0D1B16]/60 uppercase">Ratio:</span>
              {(["mellow", "balanced", "intense"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStrength(s)}
                  className={`px-2.5 py-1 rounded-sm uppercase tracking-wider text-[10px] transition-colors ${
                    strength === s
                      ? "bg-[#E8472B] text-[#EFEBE3] font-semibold"
                      : "bg-[#EFEBE3] text-[#0D1B16] hover:bg-[#D7D1C3]"
                  }`}
                >
                  {s} (1:{ratioMultipliers[s]})
                </button>
              ))}
            </div>

            {/* Real-time Calculated Recipe */}
            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-[#0D1B16]/50 uppercase text-[9px] block">DOSE</span>
                <span className="font-bold text-sm text-[#0D1B16]">{totalCoffeeGrams}g</span>
              </div>
              <div>
                <span className="text-[#0D1B16]/50 uppercase text-[9px] block">WATER</span>
                <span className="font-bold text-sm text-[#0D1B16]">{totalWaterMl}ml</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[#0D1B16]/50 uppercase text-[9px] block">TEMP</span>
                <span className="font-bold text-sm text-[#0D1B16]">93°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
