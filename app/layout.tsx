import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/global/SmoothScroll";
import CustomCursor from "@/components/global/CustomCursor";
import Preloader from "@/components/global/Preloader";
import HeaderNav from "@/components/global/HeaderNav";
import CartDrawer from "@/components/global/CartDrawer";
import GrainOverlay from "@/components/global/GrainOverlay";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SLOW TIDE Coffee Roasters — Melbourne · Auckland · Copenhagen",
  description:
    "Independent small-batch coffee roasters. Roasting at the speed of the ocean with cafés in Melbourne, Auckland, and Copenhagen. Direct farm trade, carbon-neutral shipping worldwide.",
  keywords: [
    "Specialty Coffee",
    "Single Origin Coffee",
    "Melbourne Coffee",
    "Slow Tide Roasters",
    "Filter Coffee",
    "Direct Trade",
  ],
  authors: [{ name: "SLOW TIDE Studio" }],
  openGraph: {
    title: "SLOW TIDE Coffee Roasters — Flagship Experience",
    description: "Coffee roasted at the speed of the ocean. Small-batch roastery shipping worldwide.",
    siteName: "SLOW TIDE Coffee Roasters",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-[#E8472B] selection:text-[#EFEBE3]`}
    >
      <body className="min-h-full flex flex-col bg-[#0D1B16] text-[#EFEBE3] relative font-sans">
        <SmoothScroll>
          <GrainOverlay />
          <Preloader />
          <CustomCursor />
          <HeaderNav />
          <CartDrawer />
          <main className="flex-1 w-full">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
