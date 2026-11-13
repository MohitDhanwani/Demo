"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { formatPrice } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { ASSETS } from "@/lib/assets";
import {
  ArrowRight,
  Plus,
  Clock,
  MapPin,
  ChevronDown,
  Check,
  Send,
  Sparkles,
} from "lucide-react";

interface CafeLocation {
  id: string;
  city: string;
  neighborhood: string;
  country: string;
  address: string;
  hours: string;
  timeZone: string;
  image: string;
  openHour: number; // 24h
  closeHour: number; // 24h
}

const CAFES: CafeLocation[] = [
  {
    id: "melbourne",
    city: "MELBOURNE",
    neighborhood: "Fitzroy",
    country: "Australia",
    address: "84 Argyle Street, Fitzroy VIC 3065",
    hours: "Mon – Fri: 07:00 – 16:00 · Sat – Sun: 08:00 – 16:30",
    timeZone: "Australia/Melbourne",
    image: ASSETS.cafes.melbourne,
    openHour: 7,
    closeHour: 16.5,
  },
  {
    id: "auckland",
    city: "AUCKLAND",
    neighborhood: "Ponsonby",
    country: "New Zealand",
    address: "162 Ponsonby Road, Ponsonby, Auckland 1011",
    hours: "Mon – Sun: 07:30 – 15:30",
    timeZone: "Pacific/Auckland",
    image: ASSETS.cafes.auckland,
    openHour: 7.5,
    closeHour: 15.5,
  },
  {
    id: "copenhagen",
    city: "COPENHAGEN",
    neighborhood: "Vesterbro",
    country: "Denmark",
    address: "Istedgade 48, 1650 København V",
    hours: "Mon – Fri: 08:00 – 17:00 · Sat – Sun: 09:00 – 17:00",
    timeZone: "Europe/Copenhagen",
    image: ASSETS.cafes.copenhagen,
    openHour: 8,
    closeHour: 17,
  },
];

export default function FeaturedVisit() {
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();

  // Pick 5 standout featured products for carousel
  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 5);

  const [expandedCafe, setExpandedCafe] = useState<string>("melbourne");
  const [cityTimes, setCityTimes] = useState<Record<string, { time: string; isOpen: boolean }>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Calculate live local time and open/close status per café
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      const statusMap: Record<string, { time: string; isOpen: boolean }> = {};

      CAFES.forEach((cafe) => {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: cafe.timeZone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          const timeStr = formatter.format(now);

          // Get decimal current hour in target timezone
          const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: cafe.timeZone,
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }).formatToParts(now);

          const h = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
          const m = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
          const currentDecimal = h + m / 60;

          const isOpen = currentDecimal >= cafe.openHour && currentDecimal < cafe.closeHour;
          statusMap[cafe.id] = { time: timeStr, isOpen };
        } catch {
          statusMap[cafe.id] = { time: "11:00 AM", isOpen: true };
        }
      });

      setCityTimes(statusMap);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickAdd = (product: Product) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      sizeLabel: product.sizes[0]?.label || "250g",
      grams: product.sizes[0]?.grams || 250,
      grind: product.grindOptions[0] || "Whole Bean",
      priceAud: product.priceAud,
      quantity: 1,
      isSubscription: false,
    });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail("");
  };

  return (
    <section className="relative w-full bg-[#0D1B16] text-[#EFEBE3] overflow-hidden pt-28 pb-16 select-none">
      {/* 1. FEATURED HARVEST PRODUCT CAROUSEL */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#EFEBE3]/15 pb-6">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/60 mb-2">
              <span className="w-2.5 h-[1px] bg-[#E8472B]" />
              <span>05 / CURATED LOTS & EQUIPMENT</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#EFEBE3] tracking-tight">
              Featured Harvest.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#E8472B] hover:text-[#CFE0C3] transition-colors mt-4 md:mt-0"
          >
            <span>View All 24 Offerings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Draggable Carousel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group relative bg-[#13261F] rounded-sm p-4 border border-[#EFEBE3]/10 hover:border-[#EFEBE3]/30 transition-all duration-300 flex flex-col justify-between"
              data-cursor="VIEW"
            >
              <div>
                {/* Image Container with Hover Zoom */}
                <Link
                  href={`/shop/${prod.slug}`}
                  className="block relative w-full h-56 rounded-sm overflow-hidden mb-4 bg-[#0A1410]"
                >
                  <Image
                    src={prod.images[0]}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-sm bg-[#0D1B16]/90 backdrop-blur-sm text-[9px] font-mono uppercase tracking-widest text-[#CFE0C3]">
                      {prod.originCountry}
                    </span>
                  </div>
                </Link>

                {/* Details */}
                <Link href={`/shop/${prod.slug}`} className="block">
                  <h3 className="font-serif text-xl group-hover:text-[#CFE0C3] transition-colors leading-tight">
                    {prod.name}
                  </h3>
                  <p className="text-[10px] font-mono text-[#EFEBE3]/60 mt-1 line-clamp-1">
                    {prod.process} · {prod.tastingNotes.slice(0, 2).join(", ")}
                  </p>
                </Link>
              </div>

              {/* Price & Quick Add Button */}
              <div className="pt-4 mt-4 border-t border-[#EFEBE3]/10 flex items-center justify-between">
                <div className="font-mono text-sm font-semibold text-[#EFEBE3]">
                  {formatPrice(prod.priceAud, currency)}
                </div>

                <button
                  onClick={() => handleQuickAdd(prod)}
                  className={`px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1 ${
                    addedProductId === prod.id
                      ? "bg-[#2ECC71] text-[#0D1B16]"
                      : "bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3]"
                  }`}
                  aria-label={`Quick add ${prod.name} to cart`}
                >
                  {addedProductId === prod.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. INFINITE PRESS & CRITICS MARQUEE */}
      <div className="w-full py-12 border-y border-[#EFEBE3]/15 overflow-hidden bg-[#0A1410] my-20">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-14 text-2xl md:text-4xl font-serif italic text-[#EFEBE3]/75 font-light shrink-0">
            <span>“An uncompromising exercise in slow-roast craft.” — Standart Magazine</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
            <span>“The most atmospheric coffee roastery on either coast.” — Sprudge</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
            <span>“A new Nordic benchmark in Melbourne.” — Drift</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
            <span>“Restrained, razor-sharp, and unhurried.” — Monocle</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
          </div>
          <div className="flex items-center gap-14 text-2xl md:text-4xl font-serif italic text-[#EFEBE3]/75 font-light shrink-0 ml-14">
            <span>“An uncompromising exercise in slow-roast craft.” — Standart Magazine</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
            <span>“The most atmospheric coffee roastery on either coast.” — Sprudge</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
            <span>“A new Nordic benchmark in Melbourne.” — Drift</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
            <span>“Restrained, razor-sharp, and unhurried.” — Monocle</span>
            <span className="w-2 h-2 rounded-full bg-[#E8472B]" />
          </div>
        </div>
      </div>

      {/* 3. THREE-CITY CAFÉ ACCORDION WITH LIVE LOCAL HOURS */}
      <div id="cafes" className="max-w-6xl mx-auto px-6 md:px-12 my-28">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/60 mb-2">
          <span className="w-2.5 h-[1px] bg-[#E8472B]" />
          <span>06 / PHYSICAL BARS & TASTING LABS</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#EFEBE3] tracking-tight mb-12">
          Visit Our Cafés.
        </h2>

        {/* Accordion List */}
        <div className="space-y-4">
          {CAFES.map((cafe) => {
            const isExpanded = expandedCafe === cafe.id;
            const liveStatus = cityTimes[cafe.id] || { time: "--:--", isOpen: true };

            return (
              <div
                key={cafe.id}
                className={`rounded-sm border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "border-[#EFEBE3]/30 bg-[#13261F]"
                    : "border-[#EFEBE3]/10 bg-[#0D1B16] hover:border-[#EFEBE3]/20"
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => setExpandedCafe(isExpanded ? "" : cafe.id)}
                  className="w-full p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between text-left gap-4"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-serif text-3xl md:text-4xl text-[#EFEBE3]">
                      {cafe.city}
                    </h3>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#CFE0C3]">
                      {cafe.neighborhood} · {cafe.country}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Live Open / Closed Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          liveStatus.isOpen ? "bg-[#2ECC71] animate-pulse" : "bg-[#E8472B]"
                        }`}
                      />
                      <span className="font-mono text-xs uppercase tracking-widest">
                        {liveStatus.isOpen ? "OPEN NOW" : "CLOSED NOW"} ({liveStatus.time})
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-[#EFEBE3]/60 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-[#E8472B]" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Drawer Details */}
                {isExpanded && (
                  <div className="p-6 md:p-8 pt-0 border-t border-[#EFEBE3]/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-fadeIn">
                    <div className="md:col-span-7 space-y-4 font-mono text-xs text-[#EFEBE3]/80">
                      <div>
                        <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">
                          LOCATION ADDRESS
                        </span>
                        <div className="text-sm font-sans font-normal text-[#EFEBE3]">
                          {cafe.address}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">
                          BARISTA SERVICE HOURS
                        </span>
                        <div className="text-sm font-sans font-normal text-[#CFE0C3]">
                          {cafe.hours}
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="inline-block px-3 py-1 rounded-sm border border-[#EFEBE3]/20 text-[10px] uppercase tracking-wider text-[#EFEBE3]">
                          Espresso Bar · Slow Pour V60 Flight · Bean Retail
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-5 relative h-52 rounded-sm overflow-hidden border border-[#EFEBE3]/15">
                      <Image
                        src={cafe.image}
                        alt={`${cafe.city} Café Interior`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FINALE: NEWSLETTER DISPATCH, BIG WORDMARK & FOOTER */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-32 border-t border-[#EFEBE3]/15 pt-20">
        {/* Newsletter Signup Row */}
        <div className="max-w-2xl mx-auto text-center mb-24">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E8472B] block mb-3">
            ROAST DISPATCH TELEGRAM
          </span>
          <h3 className="font-serif text-3xl md:text-5xl text-[#EFEBE3] mb-4">
            Receive the Next Crop Alert.
          </h3>
          <p className="font-sans text-xs md:text-sm text-[#EFEBE3]/60 mb-8 max-w-md mx-auto leading-relaxed">
            Direct harvest dispatches, reserve micro-lot releases, and cupping notes sent only when a new container docks.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 bg-[#142821] border border-[#EFEBE3]/20 rounded-sm px-4 py-3 text-xs font-mono text-[#EFEBE3] placeholder-[#EFEBE3]/40 focus:outline-none focus:border-[#E8472B]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-sm bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Subscribe</span>
              <Send className="w-3 h-3" />
            </button>
          </form>

          {newsletterSubmitted && (
            <div className="mt-4 text-xs font-mono text-[#2ECC71] flex items-center justify-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span>You are subscribed to Batch Dispatch announcements.</span>
            </div>
          )}
        </div>

        {/* Monumental Scaling Footer Wordmark */}
        <div className="text-center overflow-hidden my-12 border-b border-[#EFEBE3]/15 pb-12 select-none">
          <div
            className="font-serif tracking-tight text-[#EFEBE3] leading-none"
            style={{
              fontSize: "clamp(4.5rem, 18vw, 21rem)",
              letterSpacing: "-0.04em",
            }}
          >
            SLOW TIDE
          </div>
        </div>

        {/* Footer Sub-Links & Studio Colophon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/60 pt-4">
          <div>
            <div className="text-[#EFEBE3] font-semibold mb-3">ROASTERY DIRECTORY</div>
            <ul className="space-y-2">
              <li><Link href="/shop" className="hover:text-[#E8472B] transition-colors">Current Offerings</Link></li>
              <li><a href="#origin-journey" className="hover:text-[#E8472B] transition-colors">Origin Expeditions</a></li>
              <li><a href="#the-bag" className="hover:text-[#E8472B] transition-colors">Compostable Packaging</a></li>
              <li><a href="#the-ritual" className="hover:text-[#E8472B] transition-colors">Brewing Protocol</a></li>
            </ul>
          </div>

          <div>
            <div className="text-[#EFEBE3] font-semibold mb-3">CAFÉ HUBS</div>
            <ul className="space-y-2">
              <li>Melbourne: 84 Argyle St</li>
              <li>Auckland: 162 Ponsonby Rd</li>
              <li>Copenhagen: Istedgade 48</li>
            </ul>
          </div>

          <div>
            <div className="text-[#EFEBE3] font-semibold mb-3">STANDARDS</div>
            <ul className="space-y-2">
              <li>Direct Trade Certified</li>
              <li>100% Home Compostable Pouch</li>
              <li>Carbon Neutral Air Freight</li>
            </ul>
          </div>

          <div className="text-left md:text-right space-y-2">
            <div className="text-[#CFE0C3] font-semibold">FLAGSHIP PORTFOLIO BUILD</div>
            <div>DEVELOPED BY DIGITAL STUDIO</div>
            <div className="text-[#EFEBE3]/40 text-[10px]">
              NEXT.JS 15 · THREE.JS · GSAP · LENIS · TAILWIND
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
