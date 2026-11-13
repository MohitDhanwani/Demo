"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { formatPrice } from "@/lib/utils";
import FlavourRadar from "@/components/shop/FlavourRadar";
import { X, Check, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedGrind, setSelectedGrind] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const currentSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const unitPriceAud = product.priceAud * (currentSize?.priceMultiplier || 1.0);
  const effectivePriceAud = isSubscription ? unitPriceAud * 0.9 : unitPriceAud;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      sizeLabel: currentSize?.label || "250g",
      grams: currentSize?.grams || 250,
      grind: selectedGrind || product.grindOptions[0] || "Whole Bean",
      priceAud: unitPriceAud,
      quantity,
      isSubscription,
      subscriptionIntervalWeeks: isSubscription ? 3 : undefined,
    });

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10003] flex items-center justify-center p-4 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0D1B16]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#0D1B16] text-[#EFEBE3] border border-[#EFEBE3]/20 rounded-sm shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-[#EFEBE3]/20 bg-[#0D1B16]/70 flex items-center justify-center hover:bg-[#EFEBE3]/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 text-[#EFEBE3]" />
          </button>

          {/* Left: Product Image & Radar Chart */}
          <div className="w-full md:w-1/2 p-6 md:p-8 bg-[#13261F] border-b md:border-b-0 md:border-r border-[#EFEBE3]/15 flex flex-col justify-between">
            <div className="relative w-full h-64 md:h-72 rounded-sm overflow-hidden mb-6 bg-[#0A1410]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-3 left-3 bg-[#0D1B16]/80 px-2.5 py-1 rounded-sm text-[10px] font-mono uppercase tracking-widest text-[#CFE0C3]">
                {product.originCountry} · BATCH {product.roastBatch}
              </div>
            </div>

            {/* Sensory Radar Chart (for coffee products) */}
            {product.category !== "gear" && (
              <div className="bg-[#0D1B16]/60 p-4 rounded-sm border border-[#EFEBE3]/10">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B] mb-2 text-center">
                  SENSORY SPECTRUM RADAR
                </div>
                <FlavourRadar profile={product.flavourProfile} size={170} dark={true} />
              </div>
            )}
          </div>

          {/* Right: Purchase Controller & Specifications */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto no-scrollbar space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#E8472B] mb-1">
                <span>{product.originCountry}</span>
                <span>·</span>
                <span>{product.region}</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">{product.name}</h2>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-[#EFEBE3]/60">
                <span className="flex items-center gap-1 text-[#E8472B]">
                  <Star className="w-3.5 h-3.5 fill-[#E8472B]" />
                  <span className="font-semibold text-[#EFEBE3]">{product.rating}</span>
                </span>
                <span>({product.reviewsCount} verified reviews)</span>
                <span>·</span>
                <span className="text-[#CFE0C3]">{product.bagsLeftInBatch} bags left</span>
              </div>
            </div>

            <p className="text-xs font-sans text-[#EFEBE3]/75 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Tasting Notes */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 block mb-2">
                TASTING PROFILE
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.tastingNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-1 rounded-sm border border-[#EFEBE3]/20 bg-[#EFEBE3]/5 text-[11px] font-mono text-[#EFEBE3]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {product.sizes.length > 1 && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 block mb-2">
                  SELECT VOLUME
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={sz.label}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`py-2 px-3 rounded-sm border text-xs font-mono transition-colors text-center ${
                        selectedSizeIndex === idx
                          ? "border-[#E8472B] bg-[#E8472B]/10 text-[#EFEBE3] font-semibold"
                          : "border-[#EFEBE3]/20 text-[#EFEBE3]/70 hover:border-[#EFEBE3]/40"
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Grind Selector */}
            {product.grindOptions.length > 1 && (
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#EFEBE3]/40 block mb-2">
                  GRIND PROTOCOL
                </span>
                <select
                  value={selectedGrind || product.grindOptions[0]}
                  onChange={(e) => setSelectedGrind(e.target.value)}
                  className="w-full bg-[#142821] border border-[#EFEBE3]/20 rounded-sm px-3 py-2 text-xs font-mono text-[#EFEBE3] focus:outline-none focus:border-[#E8472B]"
                >
                  {product.grindOptions.map((g) => (
                    <option key={g} value={g} className="bg-[#0D1B16] text-[#EFEBE3]">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subscription Toggle */}
            {product.category !== "gear" && (
              <div className="p-3 bg-[#142821] border border-[#EFEBE3]/15 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSubscription}
                      onChange={(e) => setIsSubscription(e.target.checked)}
                      className="accent-[#E8472B] w-4 h-4 rounded"
                    />
                    <span className="font-semibold text-[#CFE0C3]">Subscribe & Save 10%</span>
                  </label>
                  <span className="text-[10px] text-[#E8472B] uppercase">Every 3 Weeks</span>
                </div>
                <div className="text-[10px] font-mono text-[#EFEBE3]/50">
                  Cancel or pause anytime. Roasted fresh and delivered to your door.
                </div>
              </div>
            )}

            {/* Price & Add To Cart Button */}
            <div className="pt-4 border-t border-[#EFEBE3]/15 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#EFEBE3]/40 block">PRICE</span>
                <div className="font-mono text-xl font-bold text-[#EFEBE3]">
                  {formatPrice(effectivePriceAud * quantity, currency)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#EFEBE3]/20 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#EFEBE3]/10 font-mono text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#EFEBE3]/10 font-mono text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-2 ${
                    added
                      ? "bg-[#2ECC71] text-[#0D1B16]"
                      : "bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3]"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Harvest</span>
                  )}
                </button>
              </div>
            </div>

            {/* Full PDP Link */}
            <div className="pt-2 text-center">
              <Link
                href={`/shop/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#CFE0C3] hover:text-[#E8472B] transition-colors"
              >
                <span>View Complete Origin Dossier & Brew Recipes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
