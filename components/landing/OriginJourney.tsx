"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { ArrowRight, Compass, Mountain, CloudRain, Sun } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OriginPanel {
  id: string;
  country: string;
  region: string;
  elevation: string;
  varietals: string;
  process: string;
  tastingNotes: string[];
  climate: string;
  image: string;
  coordinates: string;
  sampleProductSlug: string;
}

const ORIGINS: OriginPanel[] = [
  {
    id: "ethiopia",
    country: "ETHIOPIA",
    region: "Yirgacheffe & Gedeb",
    elevation: "2,050 – 2,200 MASL",
    varietals: "Indigenous Forest Heirloom",
    process: "Pure Mountain Washed & Bed Natural",
    tastingNotes: ["Bergamot", "Jasmine Bloom", "White Peach", "Earl Grey"],
    climate: "Cool Mountain Microclimate · 1,800mm Rainfall",
    image: ASSETS.origins.ethiopia.image,
    coordinates: "6.1622° N, 38.2058° E",
    sampleProductSlug: "halo-beriti-ethiopia",
  },
  {
    id: "colombia",
    country: "COLOMBIA",
    region: "Huila & Cauca",
    elevation: "1,850 – 2,000 MASL",
    varietals: "Pink Bourbon, Sidra, Geisha",
    process: "Thermal Shock Anaerobic Fermentation",
    tastingNotes: ["Pink Guava", "Wild Strawberry", "Lychee", "Rosewater"],
    climate: "Andean Cloud Forest · Volcanic Ash Soil",
    image: ASSETS.origins.colombia.landscape,
    coordinates: "2.5694° N, 76.5319° W",
    sampleProductSlug: "el-paraiso-pink-bourbon",
  },
  {
    id: "kenya",
    country: "KENYA",
    region: "Kirinyaga & Nyeri (Mt. Kenya)",
    elevation: "1,800 – 1,950 MASL",
    varietals: "SL28, SL34, Peaberry",
    process: "Double Washed & 72-Hour Fermentation",
    tastingNotes: ["Blackcurrant Jam", "Red Grapefruit", "Cane Sugar", "Rhubarb"],
    climate: "Red Volcanic Loam · Dual Monsoon Seasons",
    image: ASSETS.origins.kenya.landscape,
    coordinates: "0.4197° S, 36.9553° E",
    sampleProductSlug: "kamwangi-peaberry-kenya",
  },
  {
    id: "guatemala",
    country: "GUATEMALA",
    region: "Antigua & Palencia",
    elevation: "1,650 – 1,800 MASL",
    varietals: "Maracaturra, Yellow Bourbon",
    process: "Spring Water Washed & Honey Process",
    tastingNotes: ["Crisp Red Apple", "Toffee Brittle", "Cacao Nibs", "Mandarin"],
    climate: "Three Volcano Rain Shadow · Shade Grown",
    image: ASSETS.origins.guatemala.landscape,
    coordinates: "14.5586° N, 90.7295° W",
    sampleProductSlug: "el-socorro-guatemala",
  },
];

export default function OriginJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState(0);
  const [routeProgress, setRouteProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      if (!trackRef.current) return;
      const totalScroll = trackRef.current.scrollWidth - window.innerWidth;

      gsap.to(trackRef.current, {
        x: () => -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 0.6,
          start: "top top",
          end: () => `+=${totalScroll * 1.2}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setRouteProgress(self.progress);
            const index = Math.min(
              ORIGINS.length - 1,
              Math.floor(self.progress * ORIGINS.length)
            );
            setActivePanel(index);
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="origin-journey"
      ref={containerRef}
      className="relative w-full h-screen bg-[#0D1B16] text-[#EFEBE3] overflow-hidden select-none"
    >
      {/* Top Fixed Header HUD across the pin */}
      <div className="absolute top-0 left-0 w-full z-30 p-6 md:p-12 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/60">
          <span className="w-2.5 h-[1px] bg-[#E8472B]" />
          <span>02 / DIRECT TERROIR EXPEDITION</span>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[#CFE0C3]">
          PANEL 0{activePanel + 1} / 0{ORIGINS.length}
        </div>
      </div>

      {/* Horizontal Panels Rail */}
      <div
        ref={trackRef}
        className="flex h-full w-[400vw] will-change-transform"
      >
        {ORIGINS.map((origin, index) => (
          <div
            key={origin.id}
            className="relative w-screen h-screen flex-shrink-0 flex items-center px-6 md:px-16 lg:px-24 py-20 z-10 overflow-hidden"
          >
            {/* Background Image with Cinematic Ken Burns & Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={origin.image}
                alt={origin.country}
                fill
                priority={index === 0}
                className="object-cover opacity-35 scale-105 transition-transform duration-1000 ease-out"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B16] via-[#0D1B16]/70 to-[#0D1B16]/40" />
            </div>

            {/* Giant Outlined Watermark Country Typo */}
            <div
              className="absolute right-4 md:right-12 bottom-12 md:bottom-20 z-0 select-none pointer-events-none opacity-15 font-serif font-black tracking-tighter"
              style={{
                fontSize: "clamp(5rem, 20vw, 24rem)",
                WebkitTextStroke: "1.5px #EFEBE3",
                color: "transparent",
              }}
            >
              {origin.country}
            </div>

            {/* Foreground Content Card */}
            <div className="relative z-10 max-w-2xl mt-12 md:mt-0">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E8472B] mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>{origin.coordinates}</span>
              </div>

              <h2 className="font-serif text-5xl sm:text-6xl md:text-8xl tracking-tight text-[#EFEBE3] leading-none mb-4">
                {origin.country}
              </h2>

              <p className="font-serif italic text-2xl md:text-3xl text-[#CFE0C3] mb-8 font-light">
                {origin.region}
              </p>

              {/* Technical Dossier Grid */}
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-[#EFEBE3]/15 text-xs font-mono uppercase tracking-wider text-[#EFEBE3]/75 mb-8">
                <div>
                  <div className="flex items-center gap-1.5 text-[#EFEBE3]/40 text-[10px] mb-1">
                    <Mountain className="w-3 h-3" />
                    <span>ELEVATION</span>
                  </div>
                  <div className="font-medium text-[#EFEBE3]">{origin.elevation}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#EFEBE3]/40 text-[10px] mb-1">
                    <Sun className="w-3 h-3" />
                    <span>VARIETALS</span>
                  </div>
                  <div className="font-medium text-[#EFEBE3]">{origin.varietals}</div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[#EFEBE3]/40 text-[10px] mb-1">
                    <CloudRain className="w-3 h-3" />
                    <span>PROCESSING</span>
                  </div>
                  <div className="font-medium text-[#EFEBE3]">{origin.process}</div>
                </div>

                <div>
                  <div className="text-[#EFEBE3]/40 text-[10px] mb-1">TERROIR NOTE</div>
                  <div className="font-medium text-[#CFE0C3]">{origin.climate}</div>
                </div>
              </div>

              {/* Sensory Tasting Notes Chips */}
              <div className="mb-8">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 mb-2.5">
                  SENSORY SIGNATURE
                </div>
                <div className="flex flex-wrap gap-2">
                  {origin.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-sm border border-[#EFEBE3]/20 bg-[#EFEBE3]/5 text-xs font-mono text-[#EFEBE3]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Link to Single Origin Product */}
              <Link
                href={`/shop/${origin.sampleProductSlug}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-sm bg-[#EFEBE3] hover:bg-[#CFE0C3] text-[#0D1B16] text-xs font-mono uppercase tracking-widest font-semibold transition-colors"
                data-cursor="VIEW LOT"
              >
                <span>Acquire {origin.country} Lot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Animated SVG Maritime Supply Route Line */}
      <div className="absolute bottom-16 left-6 md:left-16 right-6 md:right-16 z-30 pointer-events-none">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/50 mb-2">
          <span>ORIGIN EXPEDITION PROGRESS</span>
          <span>ROASTERY SUPPLY LINE</span>
        </div>
        <div className="relative w-full h-[2px] bg-[#EFEBE3]/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E8472B] transition-all duration-150"
            style={{ width: `${routeProgress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
