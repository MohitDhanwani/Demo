"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatPrice } from "@/lib/utils";
import { Heart, Plus, Eye, Star, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  onQuickView,
  viewMode = "grid",
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const { currency } = useCurrencyStore();
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const selectedSize = product.sizes[selectedSizeIndex] || product.sizes[0];
  const priceAud = product.priceAud * (selectedSize?.priceMultiplier || 1.0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      sizeLabel: selectedSize?.label || "250g",
      grams: selectedSize?.grams || 250,
      grind: product.grindOptions[0] || "Whole Bean",
      priceAud: product.priceAud * (selectedSize?.priceMultiplier || 1.0),
      quantity: 1,
      isSubscription: false,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  if (viewMode === "list") {
    return (
      <div className="group relative bg-[#13261F] border border-[#EFEBE3]/10 hover:border-[#EFEBE3]/30 rounded-sm p-4 md:p-6 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link
            href={`/shop/${product.slug}`}
            className="relative w-28 h-28 rounded-sm overflow-hidden bg-[#0A1410] shrink-0"
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="112px"
            />
          </Link>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
              <span>{product.originCountry}</span>
              <span>·</span>
              <span>{product.process}</span>
              <span>·</span>
              <span className="text-[#CFE0C3]">{product.altitude}</span>
            </div>

            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-serif text-2xl group-hover:text-[#CFE0C3] transition-colors leading-tight">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs font-sans text-[#EFEBE3]/70 font-light line-clamp-1 max-w-xl">
              {product.tastingNotes.join(" · ")}
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#EFEBE3]/50">
              <Star className="w-3 h-3 fill-[#E8472B] text-[#E8472B]" />
              <span className="text-[#EFEBE3]">{product.rating}</span>
              <span>({product.reviewsCount})</span>
              <span>·</span>
              <span className="text-[#CFE0C3]">{product.bagsLeftInBatch} bags remaining</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-[#EFEBE3]/10">
          <div className="font-mono text-xl font-bold text-[#EFEBE3]">
            {formatPrice(priceAud, currency)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuickView(product)}
              className="px-3.5 py-2 rounded-sm border border-[#EFEBE3]/20 hover:border-[#EFEBE3]/50 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            <button
              onClick={handleQuickAdd}
              className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 ${
                justAdded
                  ? "bg-[#2ECC71] text-[#0D1B16]"
                  : "bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#13261F] border border-[#EFEBE3]/10 hover:border-[#EFEBE3]/30 rounded-sm p-4 transition-all duration-300 flex flex-col justify-between"
      data-cursor="VIEW"
    >
      <div>
        {/* Media Frame with Secondary Image Flip on Hover */}
        <div className="relative w-full h-64 sm:h-72 rounded-sm overflow-hidden bg-[#0A1410] mb-4">
          <Link href={`/shop/${product.slug}`} className="block w-full h-full relative">
            <Image
              src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-all duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {/* Top Origin Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-sm bg-[#0D1B16]/90 backdrop-blur-sm text-[9px] font-mono uppercase tracking-widest text-[#CFE0C3] border border-[#EFEBE3]/10">
              {product.originCountry}
            </span>
            {product.isOrganic && (
              <span className="px-2 py-0.5 rounded-sm bg-[#1A2E25]/90 text-[9px] font-mono uppercase tracking-widest text-[#2ECC71] border border-[#2ECC71]/20">
                Organic
              </span>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#0D1B16]/80 backdrop-blur-sm border border-[#EFEBE3]/15 flex items-center justify-center transition-transform active:scale-90 hover:bg-[#0D1B16]"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited ? "fill-[#E8472B] text-[#E8472B]" : "text-[#EFEBE3]/70"
              }`}
            />
          </button>

          {/* Quick View Hover Button */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onQuickView(product)}
              data-quickview="true"
              aria-label={`Quick view ${product.name}`}
              className="w-full py-2 rounded-sm bg-[#EFEBE3]/95 hover:bg-[#EFEBE3] text-[#0D1B16] text-[11px] font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 shadow-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
            <span>{product.process}</span>
            <span className="text-[#EFEBE3]/40">
              {product.roastLevel !== "N/A" ? `${product.roastLevel} Roast` : "Hardware"}
            </span>
          </div>

          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-serif text-2xl group-hover:text-[#CFE0C3] transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs font-sans text-[#EFEBE3]/65 font-light line-clamp-1">
            {product.tastingNotes.join(" · ")}
          </p>

          {/* Roast Level Indicator (Bar with 5 segments) */}
          {product.roastValue > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[9px] font-mono text-[#EFEBE3]/40 uppercase">ROAST</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`w-3.5 h-1 rounded-full ${
                      lvl <= product.roastValue ? "bg-[#E8472B]" : "bg-[#EFEBE3]/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price, Size Picker & Quick Add */}
      <div className="pt-4 mt-4 border-t border-[#EFEBE3]/10 flex items-center justify-between gap-2">
        <div>
          <span className="font-mono text-sm font-bold text-[#EFEBE3]">
            {formatPrice(priceAud, currency)}
          </span>
          {product.sizes.length > 1 && (
            <select
              value={selectedSizeIndex}
              onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}
              className="block bg-transparent text-[10px] font-mono text-[#EFEBE3]/50 focus:outline-none cursor-pointer mt-0.5"
            >
              {product.sizes.map((s, idx) => (
                <option key={s.label} value={idx} className="bg-[#0D1B16] text-[#EFEBE3]">
                  {s.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          disabled={justAdded}
          className={`px-3.5 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1 shrink-0 ${
            justAdded
              ? "bg-[#2ECC71] text-[#0D1B16]"
              : "bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3]"
          }`}
          aria-label={`Quick add ${product.name} to cart`}
        >
          {justAdded ? (
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
  );
}
