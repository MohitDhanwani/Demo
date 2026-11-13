import HeroSection from "@/components/landing/HeroSection";
import ManifestoSection from "@/components/landing/ManifestoSection";
import OriginJourney from "@/components/landing/OriginJourney";
import BagScrollySection from "@/components/landing/BagScrollySection";
import RitualSection from "@/components/landing/RitualSection";
import FeaturedVisit from "@/components/landing/FeaturedVisit";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-[#0D1B16] text-[#EFEBE3]">
      {/* 1. Hero with 3D Instanced Beans & Scroll Vortex */}
      <HeroSection />

      {/* 2. Manifesto with Scroll-Scrubbed Text & Drifting Media */}
      <ManifestoSection />

      {/* 3. Origin Journey Pinned Horizontal Expedition */}
      <OriginJourney />

      {/* 4. The Bag: 3D Product Scrollytelling Inspection */}
      <BagScrollySection />

      {/* 5. The Ritual: 5-Step Stepper & Precision Ratio Calculator */}
      <RitualSection />

      {/* 6. Featured Roasts Carousel, Press Marquee, 3-City Cafés & Finale */}
      <FeaturedVisit />
    </div>
  );
}
