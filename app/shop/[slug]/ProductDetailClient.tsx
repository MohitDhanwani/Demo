"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";
import FlavourRadar from "@/components/shop/FlavourRadar";
import BrewGuideWidget from "@/components/shop/BrewGuideWidget";
import BagViewer3D from "@/components/3d/BagViewer3D";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";
import {
  Heart,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  Truck,
  Leaf,
  ChevronRight,
  Sparkles,
  Rotate3d,
  ImageIcon,
  ThumbsUp,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  pairsWellWith: Product[];
}

export default function ProductDetailClient({
  product,
  pairsWellWith,
}: ProductDetailClientProps) {
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [activeMediaTab, setActiveMediaTab] = useState<"gallery" | "3d">("gallery");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState(product.grindOptions[0] || "Whole Bean");
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [subscriptionInterval, setSubscriptionInterval] = useState(3);
  const [activeTab, setActiveTab] = useState<"brew" | "shipping" | "sustainability">("brew");
  const [justAdded, setJustAdded] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Review state
  const [reviews, setReviews] = useState([
    {
      id: "rev-1",
      author: "Julian Thorne (Certified Q-Grader)",
      date: "3 days ago",
      rating: 5,
      title: "Archetypal washed florals with crystalline clarity",
      comment:
        "Pulled on an 8.5 bar flat-profile machine and brewed through a flat-bottom Kalita. The bergamot aromatics on the dry fragrance are astonishing. Luminous peach acidity as it cools down to 60°C.",
      helpful: 14,
    },
    {
      id: "rev-2",
      author: "Freja Lindqvist",
      date: "2 weeks ago",
      rating: 5,
      title: "Nordic precision, completely devoid of bitterness",
      comment:
        "Having visited the Copenhagen bar regularly, this lot shipped to my home in London arrives within 3 days of roasting. Beautiful packaging and honest terroir.",
      helpful: 9,
    },
    {
      id: "rev-3",
      author: "Marcus Vance",
      date: "1 month ago",
      rating: 5,
      title: "Subscribed and never turning back",
      comment:
        "The automated 3-week subscription ensures I always have whole beans rested exactly 7 days post-roast. Perfect daily batch brew.",
      helpful: 5,
    },
  ]);

  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const selectedSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const unitPriceAud = product.priceAud * (selectedSize?.priceMultiplier || 1.0);
  const effectivePriceAud = isSubscription ? unitPriceAud * 0.9 : unitPriceAud;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      sizeLabel: selectedSize?.label || "250g",
      grams: selectedSize?.grams || 250,
      grind: selectedGrind,
      priceAud: unitPriceAud,
      quantity,
      isSubscription,
      subscriptionIntervalWeeks: isSubscription ? subscriptionInterval : undefined,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewTitle || !newReviewComment) return;

    setReviews([
      {
        id: `rev-${Date.now()}`,
        author: newReviewAuthor,
        date: "Just now",
        rating: newReviewRating,
        title: newReviewTitle,
        comment: newReviewComment,
        helpful: 0,
      },
      ...reviews,
    ]);

    setNewReviewAuthor("");
    setNewReviewTitle("");
    setNewReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#0D1B16] text-[#EFEBE3] pt-28 pb-32 select-none">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-2 text-xs font-mono text-[#EFEBE3]/50 border-b border-[#EFEBE3]/10">
        <Link href="/" className="hover:text-[#EFEBE3] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-[#EFEBE3] transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#CFE0C3] uppercase">{product.name}</span>
      </div>

      {/* Freshness Urgency Banner */}
      <div className="bg-[#142821] border-b border-[#EFEBE3]/10 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-mono gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-[#CFE0C3]">
            <span className="w-2 h-2 rounded-full bg-[#E8472B] animate-pulse" />
            <span>
              ROAST BATCH #{product.roastBatch} · ROASTED {product.roastedDaysAgo} DAYS AGO
            </span>
          </div>
          <div className="text-[#E8472B] font-semibold">
            {product.bagsLeftInBatch} bags remaining in current roast allotment
          </div>
        </div>
      </div>

      {/* Main Two-Column Viewport: Gallery / 3D Viewer vs Purchase Control */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Visual Stage (Photography vs Interactive 3D Bag) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Media View Mode Switcher Tab */}
          <div className="flex items-center gap-2 p-1 bg-[#13261F] rounded-sm border border-[#EFEBE3]/15 w-fit font-mono text-xs">
            <button
              onClick={() => setActiveMediaTab("gallery")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm transition-colors ${
                activeMediaTab === "gallery"
                  ? "bg-[#E8472B] text-[#EFEBE3] font-semibold"
                  : "text-[#EFEBE3]/70 hover:text-[#EFEBE3]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photography Gallery</span>
            </button>

            <button
              onClick={() => setActiveMediaTab("3d")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-sm transition-colors ${
                activeMediaTab === "3d"
                  ? "bg-[#E8472B] text-[#EFEBE3] font-semibold"
                  : "text-[#EFEBE3]/70 hover:text-[#EFEBE3]"
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5 text-[#CFE0C3]" />
              <span>3D Bag Viewer (Orbit 360°)</span>
            </button>
          </div>

          {/* Media Canvas Area */}
          {activeMediaTab === "gallery" ? (
            <div className="space-y-4">
              {/* Primary Large Image Frame */}
              <div className="relative w-full h-96 sm:h-[520px] rounded-sm overflow-hidden bg-[#13261F] border border-[#EFEBE3]/15 group">
                <Image
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute top-4 left-4 bg-[#0D1B16]/85 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-mono uppercase tracking-widest text-[#CFE0C3] border border-[#EFEBE3]/10">
                  {product.originCountry} · {product.process}
                </div>
              </div>

              {/* Thumbnails Rail */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-24 h-24 rounded-sm overflow-hidden border shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? "border-[#E8472B] ring-1 ring-[#E8472B]"
                          : "border-[#EFEBE3]/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="Thumbnail" fill className="object-cover" sizes="96px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Interactive 3D Coffee Bag Stage */
            <div className="relative w-full h-[520px] rounded-sm bg-[#13261F] border border-[#EFEBE3]/20 overflow-hidden flex flex-col justify-between p-6">
              <div className="relative z-10 flex items-center justify-between font-mono text-xs text-[#CFE0C3]">
                <div className="flex items-center gap-2">
                  <Rotate3d className="w-4 h-4 text-[#E8472B] animate-spin" />
                  <span>360° ORBIT INSPECTION</span>
                </div>
                <span>CLICK & DRAG TO SPIN</span>
              </div>

              <div className="absolute inset-0 z-0">
                <BagViewer3D scrollProgress={0.9} interactive={true} />
              </div>

              <div className="relative z-10 text-[10px] font-mono text-[#EFEBE3]/50 text-center">
                REAL-TIME WEBGL RENDER · UV-BARRIER INK-GREEN POUCH
              </div>
            </div>
          )}

          {/* Sensory Profile & Terroir Section */}
          {product.category !== "gear" && (
            <div className="p-6 md:p-8 rounded-sm bg-[#13261F] border border-[#EFEBE3]/15 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B] block mb-2">
                  FLAVOUR ARCHITECTURE
                </span>
                <h3 className="font-serif text-2xl mb-3">Sensory Spectrum Radar</h3>
                <p className="text-xs font-sans text-[#EFEBE3]/70 font-light leading-relaxed mb-4">
                  Triangulated by our roastery lab across 5 distinct flavor vectors. Evaluated at 93°C, 70°C, and 55°C.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-1 rounded-sm border border-[#EFEBE3]/20 bg-[#0D1B16]/60 text-xs font-mono text-[#EFEBE3]"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <FlavourRadar profile={product.flavourProfile} size={220} dark={true} />
              </div>
            </div>
          )}

          {/* Terroir Dossier Table */}
          <div className="p-6 md:p-8 rounded-sm bg-[#13261F] border border-[#EFEBE3]/15 font-mono text-xs space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-[#E8472B] block">
              ORIGIN & BOTANICAL DOSSIER
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2 border-t border-[#EFEBE3]/10">
              <div>
                <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">COUNTRY & REGION</span>
                <div className="text-sm font-sans font-medium text-[#EFEBE3]">
                  {product.originCountry}, {product.region}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">ELEVATION</span>
                <div className="text-sm font-sans font-medium text-[#CFE0C3]">
                  {product.altitude}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">PRODUCER</span>
                <div className="text-sm font-sans font-medium text-[#EFEBE3]">
                  {product.producer}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">BOTANICAL VARIETAL</span>
                <div className="text-sm font-sans font-medium text-[#EFEBE3]">
                  {product.varietal}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">PROCESSING METHOD</span>
                <div className="text-sm font-sans font-medium text-[#CFE0C3]">
                  {product.process}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-[#EFEBE3]/40 block mb-1">HARVEST WINDOW</span>
                <div className="text-sm font-sans font-medium text-[#EFEBE3]">
                  {product.harvestSeason}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Purchase Configurator Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8 bg-[#13261F] border border-[#EFEBE3]/15 rounded-sm p-6 md:p-8">
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-mono">
              <span className="uppercase text-[#E8472B] tracking-widest">
                {product.originCountry} · {product.process}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center gap-1.5 text-xs text-[#EFEBE3]/70 hover:text-[#E8472B]"
              >
                <Heart
                  className={`w-4 h-4 ${isFavorited ? "fill-[#E8472B] text-[#E8472B]" : ""}`}
                />
                <span className="hidden sm:inline">{isFavorited ? "Saved" : "Save"}</span>
              </button>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl leading-tight mb-2">
              {product.name}
            </h1>
            <p className="font-serif italic text-lg text-[#CFE0C3] font-light">
              {product.subtitle}
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs font-mono text-[#EFEBE3]/60">
              <span className="flex items-center gap-1 text-[#E8472B]">
                <Star className="w-3.5 h-3.5 fill-[#E8472B]" />
                <span className="font-semibold text-[#EFEBE3]">{product.rating}</span>
              </span>
              <span>({product.reviewsCount} reviews)</span>
              <span>·</span>
              <span className="text-[#CFE0C3]">{product.bagsLeftInBatch} bags remaining</span>
            </div>
          </div>

          {/* Roast Indicator Bar */}
          {product.roastValue > 0 && (
            <div className="flex items-center justify-between p-3 rounded-sm bg-[#0D1B16] border border-[#EFEBE3]/10 font-mono text-xs">
              <span className="text-[10px] uppercase text-[#EFEBE3]/50">ROAST PROFILE</span>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`w-4 h-1.5 rounded-full ${
                        lvl <= product.roastValue ? "bg-[#E8472B]" : "bg-[#EFEBE3]/15"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-[#EFEBE3]">{product.roastLevel}</span>
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes.length > 1 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 block mb-2.5">
                PACKAGE VOLUME
              </span>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((sz, idx) => (
                  <button
                    key={sz.label}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`py-2.5 px-3 rounded-sm border text-xs font-mono transition-colors text-center ${
                      selectedSizeIndex === idx
                        ? "border-[#E8472B] bg-[#E8472B]/15 text-[#EFEBE3] font-bold"
                        : "border-[#EFEBE3]/20 text-[#EFEBE3]/70 hover:border-[#EFEBE3]/40"
                    }`}
                  >
                    <div>{sz.label}</div>
                    <div className="text-[10px] opacity-60">
                      {formatPrice(product.priceAud * sz.priceMultiplier, currency)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grind Selector */}
          {product.grindOptions.length > 1 && (
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 block mb-2.5">
                GRIND PROTOCOL
              </span>
              <select
                value={selectedGrind}
                onChange={(e) => setSelectedGrind(e.target.value)}
                className="w-full bg-[#0D1B16] border border-[#EFEBE3]/20 rounded-sm px-3.5 py-3 text-xs font-mono text-[#EFEBE3] focus:outline-none focus:border-[#E8472B] cursor-pointer"
              >
                {product.grindOptions.map((g) => (
                  <option key={g} value={g} className="bg-[#0D1B16] text-[#EFEBE3]">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Purchase Mode Toggle: One-time vs Subscribe & Save */}
          {product.category !== "gear" && (
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10px] uppercase tracking-widest text-[#EFEBE3]/40 block">
                PURCHASE FREQUENCY
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsSubscription(false)}
                  className={`p-3 rounded-sm border text-left transition-colors ${
                    !isSubscription
                      ? "border-[#EFEBE3] bg-[#0D1B16] text-[#EFEBE3]"
                      : "border-[#EFEBE3]/20 text-[#EFEBE3]/60 hover:border-[#EFEBE3]/40"
                  }`}
                >
                  <div className="font-bold">One-Time</div>
                  <div className="text-[10px] opacity-60">Standard allotment</div>
                </button>

                <button
                  onClick={() => setIsSubscription(true)}
                  className={`p-3 rounded-sm border text-left transition-colors ${
                    isSubscription
                      ? "border-[#E8472B] bg-[#E8472B]/10 text-[#EFEBE3]"
                      : "border-[#EFEBE3]/20 text-[#EFEBE3]/60 hover:border-[#EFEBE3]/40"
                  }`}
                >
                  <div className="font-bold text-[#CFE0C3] flex items-center justify-between">
                    <span>Subscribe</span>
                    <span className="text-[9px] bg-[#E8472B] text-[#EFEBE3] px-1.5 py-0.5 rounded">
                      -10%
                    </span>
                  </div>
                  <div className="text-[10px] opacity-60">Auto-roasted & shipped</div>
                </button>
              </div>

              {isSubscription && (
                <div className="p-3 bg-[#0D1B16] rounded-sm border border-[#CFE0C3]/20 flex items-center justify-between">
                  <span className="text-[11px] text-[#CFE0C3]">DELIVERY CADENCE:</span>
                  <select
                    value={subscriptionInterval}
                    onChange={(e) => setSubscriptionInterval(Number(e.target.value))}
                    className="bg-transparent text-xs font-mono text-[#EFEBE3] focus:outline-none cursor-pointer"
                  >
                    <option value={2} className="bg-[#0D1B16]">Every 2 Weeks</option>
                    <option value={3} className="bg-[#0D1B16]">Every 3 Weeks (Recommended)</option>
                    <option value={4} className="bg-[#0D1B16]">Every 4 Weeks</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Pricing & Add to Cart Action */}
          <div className="pt-4 border-t border-[#EFEBE3]/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#EFEBE3]/40 block">
                  {isSubscription ? "SUBSCRIPTION TOTAL" : "SUBTOTAL"}
                </span>
                <div className="font-mono text-2xl font-bold text-[#EFEBE3]">
                  {formatPrice(effectivePriceAud * quantity, currency)}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#EFEBE3]/20 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-[#EFEBE3]/10 font-mono text-base"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-mono font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-[#EFEBE3]/10 font-mono text-base"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={justAdded}
              className={`w-full py-4 rounded-sm font-mono text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 shadow-xl ${
                justAdded
                  ? "bg-[#2ECC71] text-[#0D1B16]"
                  : "bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Harvest Added to Cart</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Harvest Selection</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="space-y-2 pt-2 border-t border-[#EFEBE3]/10 text-[11px] font-mono text-[#EFEBE3]/50">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#CFE0C3]" />
              <span>Complimentary worldwide express shipping over A$60</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5 text-[#2ECC71]" />
              <span>100% Home compostable pouch · Zero plastic liner</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8472B]" />
              <span>Roasted strictly to order · Dispatched Mon & Thu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Guide Tabs (Brewing, Shipping, Sustainability) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24">
        <div className="border-b border-[#EFEBE3]/15 flex items-center gap-8 font-mono text-xs uppercase tracking-widest pb-4">
          <button
            onClick={() => setActiveTab("brew")}
            className={`transition-colors pb-1 relative ${
              activeTab === "brew" ? "text-[#E8472B] font-bold" : "text-[#EFEBE3]/60 hover:text-[#EFEBE3]"
            }`}
          >
            <span>Brewing Protocol</span>
            {activeTab === "brew" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8472B]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("shipping")}
            className={`transition-colors pb-1 relative ${
              activeTab === "shipping" ? "text-[#E8472B] font-bold" : "text-[#EFEBE3]/60 hover:text-[#EFEBE3]"
            }`}
          >
            <span>Air Freight Logistics</span>
            {activeTab === "shipping" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8472B]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("sustainability")}
            className={`transition-colors pb-1 relative ${
              activeTab === "sustainability"
                ? "text-[#E8472B] font-bold"
                : "text-[#EFEBE3]/60 hover:text-[#EFEBE3]"
            }`}
          >
            <span>Compostable Ethics</span>
            {activeTab === "sustainability" && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#E8472B]" />
            )}
          </button>
        </div>

        {/* Tab Panels */}
        <div className="pt-8">
          {activeTab === "brew" && <BrewGuideWidget guide={product.brewGuide} />}

          {activeTab === "shipping" && (
            <div className="max-w-3xl font-mono text-xs space-y-4 text-[#EFEBE3]/80 leading-relaxed">
              <p>
                We dispatch coffee freshly roasted twice a week: every Monday and Thursday morning from our Melbourne, Auckland, and Copenhagen roasteries.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#EFEBE3]">
                <li>
                  <strong>Australia & New Zealand:</strong> Next-day air dispatch via AusPost Express / CourierPost.
                </li>
                <li>
                  <strong>Europe & UK:</strong> 2-4 business days via DHL Express Carbon Neutral.
                </li>
                <li>
                  <strong>USA & Rest of World:</strong> 3-5 business days air freight via FedEx International Priority.
                </li>
              </ul>
              <p className="text-[11px] text-[#CFE0C3]">
                All coffee is sealed immediately post-roast into degassing pouches to ensure beans rest in an anaerobic environment during flight transit.
              </p>
            </div>
          )}

          {activeTab === "sustainability" && (
            <div className="max-w-3xl font-mono text-xs space-y-4 text-[#EFEBE3]/80 leading-relaxed">
              <p>
                Direct farm trade is the cornerstone of SLOW TIDE. We work outside commercial commodity exchanges, paying a guaranteed minimum of 180% to 320% above the C-Market price directly to estate producers and smallholder washing stations.
              </p>
              <p>
                Packaging: Our pouches are certified EN 13432 and ASTM D6400 home compostable. Remove the tin-tie and place the empty bag directly in your household organic waste bin or home worm farm. It returns to earth within 180 days.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-28 border-t border-[#EFEBE3]/15 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#E8472B] mb-2">
              <Star className="w-3.5 h-3.5 fill-[#E8472B]" />
              <span>VERIFIED SENSORY REVIEWS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">
              Customer Evaluations.
            </h2>
          </div>

          <div className="flex items-baseline gap-3 mt-4 md:mt-0 font-mono text-xs">
            <span className="text-3xl font-bold text-[#EFEBE3]">{product.rating}</span>
            <span className="text-[#EFEBE3]/50">/ 5.0 RATING ({reviews.length} EVALUATIONS)</span>
          </div>
        </div>

        {/* Reviews List & Write Review Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-sm bg-[#13261F] border border-[#EFEBE3]/10 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#EFEBE3]">{rev.author}</span>
                    <span className="text-[10px] bg-[#CFE0C3]/10 text-[#CFE0C3] px-2 py-0.5 rounded">
                      VERIFIED BUYER
                    </span>
                  </div>
                  <span className="text-[#EFEBE3]/40">{rev.date}</span>
                </div>

                <div className="flex gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#E8472B] text-[#E8472B]" />
                  ))}
                </div>

                <h4 className="font-serif text-xl text-[#EFEBE3]">{rev.title}</h4>
                <p className="font-sans text-xs text-[#EFEBE3]/75 font-light leading-relaxed">
                  {rev.comment}
                </p>

                <div className="pt-2 flex items-center gap-2 text-[10px] font-mono text-[#EFEBE3]/40">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rev.helpful} individuals found this evaluation helpful</span>
                </div>
              </div>
            ))}
          </div>

          {/* Write a Review Submission Form */}
          <div className="lg:col-span-5 p-6 rounded-sm bg-[#13261F] border border-[#EFEBE3]/15 self-start space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B] block">
              SUBMIT SENSORY EVALUATION
            </span>
            <h3 className="font-serif text-2xl">Share Your Tasting Notes</h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase text-[#EFEBE3]/50 mb-1">
                  YOUR RATING
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newReviewRating
                            ? "fill-[#E8472B] text-[#E8472B]"
                            : "text-[#EFEBE3]/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#EFEBE3]/50 mb-1">
                  YOUR NAME OR TITLE
                </label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Liam T. / Home Barista"
                  required
                  className="w-full bg-[#0D1B16] border border-[#EFEBE3]/20 rounded-sm px-3 py-2 text-xs font-mono text-[#EFEBE3] focus:outline-none focus:border-[#E8472B]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#EFEBE3]/50 mb-1">
                  HEADLINE SUMMARY
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Crisp peach acidity on V60"
                  required
                  className="w-full bg-[#0D1B16] border border-[#EFEBE3]/20 rounded-sm px-3 py-2 text-xs font-mono text-[#EFEBE3] focus:outline-none focus:border-[#E8472B]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-[#EFEBE3]/50 mb-1">
                  DETAILED EVALUATION
                </label>
                <textarea
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Detail your extraction parameters, grinder, water temp, and sensory observations..."
                  rows={4}
                  required
                  className="w-full bg-[#0D1B16] border border-[#EFEBE3]/20 rounded-sm px-3 py-2 text-xs font-mono text-[#EFEBE3] focus:outline-none focus:border-[#E8472B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-sm bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest font-semibold transition-colors"
              >
                Submit Review
              </button>

              {reviewSubmitted && (
                <div className="text-xs font-mono text-[#2ECC71] flex items-center gap-1.5 justify-center pt-2">
                  <Check className="w-3.5 h-3.5" />
                  <span>Evaluation submitted and published to batch record.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Pairs Well With Carousel */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-28 border-t border-[#EFEBE3]/15 pt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#E8472B] block mb-1">
              CURATED COMPLEMENTS
            </span>
            <h2 className="font-serif text-3xl md:text-4xl">Pairs Well With.</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-mono uppercase tracking-widest text-[#CFE0C3] hover:text-[#E8472B] transition-colors"
          >
            Explore Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pairsWellWith.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={setQuickViewProduct}
              viewMode="grid"
            />
          ))}
        </div>
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0D1B16]/95 backdrop-blur-md border-t border-[#EFEBE3]/15 p-4 z-40 lg:hidden flex items-center justify-between gap-4">
        <div>
          <div className="font-serif text-lg leading-tight line-clamp-1">{product.name}</div>
          <div className="font-mono text-sm font-bold text-[#E8472B]">
            {formatPrice(effectivePriceAud * quantity, currency)}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="px-6 py-3 rounded-sm bg-[#E8472B] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest font-semibold shrink-0"
        >
          Add to Bag
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
