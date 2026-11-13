"use client";

import { useCartStore } from "@/store/useCartStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotalAud, getShippingProgress, addItem } =
    useCartStore();
  const { currency } = useCurrencyStore();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotalAud = getSubtotalAud();
  const shipping = getShippingProgress();

  const handleCheckoutMock = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      closeCart();
    }, 2800);
  };

  const handleAddUpsell = () => {
    addItem({
      productId: "prod-24",
      slug: "precision-cupping-spoon-04",
      name: "Titanium Cupping Spoon No. 04",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
      sizeLabel: "Standard SCA Bowl",
      grams: 32,
      grind: "Hardware",
      priceAud: 38,
      quantity: 1,
      isSubscription: false,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10002] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#0D1B16]/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#0D1B16] text-[#EFEBE3] border-l border-[#EFEBE3]/15 h-full flex flex-col z-10 shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#EFEBE3]/15 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl tracking-tight">Your Harvest</h3>
                <span className="font-mono text-xs uppercase tracking-widest text-[#EFEBE3]/50">
                  {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length === 1 ? "Item" : "Items"} in Cart
                </span>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full border border-[#EFEBE3]/20 flex items-center justify-center hover:bg-[#EFEBE3]/10 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4 text-[#EFEBE3]" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="px-6 py-3.5 bg-[#142821] border-b border-[#EFEBE3]/10">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-[#CFE0C3]">
                  {shipping.isFree
                    ? "✓ Complimentary Global Express Unlocked"
                    : `Add ${formatPrice(shipping.remaining, currency)} for Free Global Shipping`}
                </span>
                <span className="opacity-60">{shipping.progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#0D1B16] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#E8472B]"
                  initial={{ width: 0 }}
                  animate={{ width: `${shipping.progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border border-[#EFEBE3]/20 flex items-center justify-center font-serif italic text-2xl text-[#EFEBE3]/40">
                    Ø
                  </div>
                  <p className="font-serif text-xl text-[#EFEBE3]/70">Your selection is empty.</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#E8472B] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest hover:bg-[#d43c22] transition-colors"
                  >
                    <span>Browse Roasts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const effectivePrice = item.isSubscription ? item.priceAud * 0.9 : item.priceAud;
                  return (
                    <div
                      key={item.cartItemId}
                      className="flex gap-4 pb-5 border-b border-[#EFEBE3]/10 last:border-b-0"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 bg-[#142821] rounded-sm overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif text-lg leading-tight">{item.name}</h4>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-[#EFEBE3]/40 hover:text-[#E8472B] transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-xs font-mono text-[#EFEBE3]/60 mt-1">
                            {item.sizeLabel} · {item.grind}
                          </div>
                          {item.isSubscription && (
                            <span className="inline-block mt-1 font-mono text-[10px] uppercase tracking-wider text-[#CFE0C3] bg-[#CFE0C3]/10 px-2 py-0.5 rounded">
                              Subscribed (-10%)
                            </span>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#EFEBE3]/20 rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#EFEBE3]/10 text-[#EFEBE3]/70 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-mono">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#EFEBE3]/10 text-[#EFEBE3]/70 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-mono text-sm font-medium">
                            {formatPrice(effectivePrice * item.quantity, currency)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Upsell Widget */}
              {items.length > 0 && (
                <div className="p-4 rounded-sm border border-[#CFE0C3]/20 bg-[#162B23]/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#CFE0C3] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[#EFEBE3]">Add Cupping Spoon No. 04</div>
                      <div className="text-[10px] font-mono text-[#EFEBE3]/60">Pure Grade 2 Titanium · {formatPrice(38, currency)}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleAddUpsell}
                    className="px-2.5 py-1.5 rounded-sm bg-[#EFEBE3] text-[#0D1B16] text-[10px] font-mono uppercase font-bold tracking-wider hover:bg-[#CFE0C3] transition-colors shrink-0"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#EFEBE3]/15 bg-[#0A1410] space-y-4">
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-[#EFEBE3]/60">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotalAud, currency)}</span>
                  </div>
                  <div className="flex justify-between text-[#EFEBE3]/60">
                    <span>Air Freight</span>
                    <span>{shipping.isFree ? "Free" : formatPrice(12, currency)}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-[#EFEBE3] pt-2 border-t border-[#EFEBE3]/10">
                    <span>Estimated Total</span>
                    <span className="font-mono font-medium">
                      {formatPrice(subtotalAud + (shipping.isFree ? 0 : 12), currency)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutMock}
                  disabled={checkoutSuccess}
                  className={`w-full py-4 rounded-sm flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest font-semibold transition-all ${
                    checkoutSuccess
                      ? "bg-[#2ECC71] text-[#0D1B16]"
                      : "bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3]"
                  }`}
                >
                  {checkoutSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Order Confirmed (Batch Dispatched)</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#EFEBE3]/40">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CFE0C3]" />
                  <span>Carbon-neutral roastery delivery & compostable packaging</span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
