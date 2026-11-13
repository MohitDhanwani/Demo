"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import CurrencySelector from "@/components/global/CurrencySelector";
import CommandPalette from "@/components/shop/CommandPalette";
import MagneticButton from "@/components/ui/MagneticButton";
import { Search, ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeaderNav() {
  const pathname = usePathname();
  const { openCart, getTotalItemsCount } = useCartStore();
  const [itemsCount, setItemsCount] = useState(0);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Sync count on hydration
  useEffect(() => {
    setItemsCount(getTotalItemsCount());
  }, [getTotalItemsCount]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Auto hide on scroll down, show on scroll up
      if (currentScrollY > 200) {
        if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 10) {
          setIsVisible(false);
        } else if (lastScrollY - currentScrollY > 10) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Roasts", href: "/shop" },
    { label: "Manifesto", href: "/#manifesto" },
    { label: "Origins", href: "/#origin-journey" },
    { label: "The Bag", href: "/#the-bag" },
    { label: "Ritual", href: "/#the-ritual" },
    { label: "Cafés", href: "/#cafes" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[900] transition-all duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-[#0D1B16]/90 backdrop-blur-md border-b border-[#EFEBE3]/10 py-3.5"
            : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            href="/"
            className="group flex items-baseline gap-2 text-decoration-none select-none"
            data-cursor="HOME"
          >
            <span className="font-serif text-2xl md:text-3xl tracking-tight text-[#EFEBE3] group-hover:text-[#CFE0C3] transition-colors">
              SLOW TIDE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8472B] inline-block animate-pulse" />
            <span className="hidden lg:inline-block font-mono text-[9px] uppercase tracking-widest text-[#EFEBE3]/40 border-l border-[#EFEBE3]/20 pl-2">
              ROASTERY & LAB
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-[#EFEBE3]/75">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative py-1 hover:text-[#EFEBE3] transition-colors group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#E8472B] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Currency Selector (Desktop) */}
            <div className="hidden sm:block">
              <CurrencySelector darkTheme={true} />
            </div>

            {/* ⌘K Command Palette Button */}
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border border-[#EFEBE3]/20 bg-[#0D1B16]/60 text-xs font-mono text-[#EFEBE3]/80 hover:border-[#EFEBE3]/50 transition-colors"
              aria-label="Search roasts"
              data-cursor="SEARCH"
            >
              <Search className="w-3.5 h-3.5 text-[#EFEBE3]" />
              <span className="hidden xl:inline text-[11px] text-[#EFEBE3]/50 font-mono">⌘K</span>
            </button>

            {/* Cart Trigger */}
            <MagneticButton strength={0.3} dataCursor="CART">
              <button
                onClick={openCart}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#E8472B] hover:bg-[#d63f24] text-[#EFEBE3] text-xs font-mono uppercase tracking-widest transition-colors font-medium"
                aria-label="Open cart drawer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Harvest</span>
                <span className="w-4 h-4 rounded-full bg-[#0D1B16] text-[#EFEBE3] text-[10px] flex items-center justify-center font-bold">
                  {itemsCount}
                </span>
              </button>
            </MagneticButton>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-sm border border-[#EFEBE3]/20 flex items-center justify-center text-[#EFEBE3] hover:bg-[#EFEBE3]/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[890] bg-[#0D1B16] text-[#EFEBE3] flex flex-col justify-between pt-28 pb-8 px-6 overflow-y-auto md:hidden"
          >
            <div className="space-y-6">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#E8472B]">
                NAVIGATION DIRECTORY
              </div>
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-3xl hover:italic hover:text-[#CFE0C3] transition-all flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-5 h-5 opacity-40" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#EFEBE3]/15 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-[#EFEBE3]/60">
                  Select Currency
                </span>
                <CurrencySelector darkTheme={true} />
              </div>
              <div className="text-xs font-mono text-[#EFEBE3]/40 space-y-1">
                <div>MELBOURNE · AUCKLAND · COPENHAGEN</div>
                <div>ROASTED WEEKLY · DISPATCH MON & THU</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
