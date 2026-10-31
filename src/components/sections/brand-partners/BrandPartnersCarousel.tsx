"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface BrandData {
  id: string;
  name: string;
  image?: string;
  isYourBrand?: boolean;
}

export const REAL_BRANDS: BrandData[] = [
  {
    id: "ilw",
    name: "PT. International Leather Works",
    image: "/images/partnership/partner-ilw.png",
  },
  {
    id: "syncteam",
    name: "SynchronizeTeams",
    image: "/images/partnership/partner-syncteam.png",
  },
  {
    id: "devaccto",
    name: "Devaccto RPL",
    image: "/images/partnership/partner-devacctorpl.png",
  },
  {
    id: "maxwell",
    name: "Maxwell Chemicals",
    image: "/images/partnership/partner-maxwellchemicals.png",
  },
  {
    id: "sarananusa",
    name: "Sarana Nusa Pakan",
    image: "/images/partnership/partner-sarananusapakan.png",
  },
  {
    id: "yourbrand",
    name: "Your brand here",
    isYourBrand: true,
  },
];

export function BrandPartnersCarousel({
  subheading = "Trusted by teams across industries",
  heading = "You might be next",
}: {
  subheading?: string;
  heading?: string;
}) {
  const [activeBrands, setActiveBrands] = useState<BrandData[]>([
    REAL_BRANDS[0], 
    REAL_BRANDS[1],
    REAL_BRANDS[2], 
    REAL_BRANDS[5], 
  ]);

  const [isPaused, setIsPaused] = useState(false);
  const lastSwitchedSlotRef = useRef<number>(-1);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveBrands((currentSlots) => {
        const availableSlotIndices = [0, 1, 2, 3].filter(
          (idx) => idx !== lastSwitchedSlotRef.current
        );
        const slotToSwitch =
          availableSlotIndices[
            Math.floor(Math.random() * availableSlotIndices.length)
          ];
        lastSwitchedSlotRef.current = slotToSwitch;

        const otherSlotIds = new Set(
          currentSlots
            .filter((_, idx) => idx !== slotToSwitch)
            .map((b) => b.id)
        );

        const candidatePool = REAL_BRANDS.filter(
          (b) => !otherSlotIds.has(b.id) && b.id !== currentSlots[slotToSwitch].id
        );

        if (candidatePool.length === 0) return currentSlots;

        const nextBrand =
          candidatePool[Math.floor(Math.random() * candidatePool.length)];

        const newSlots = [...currentSlots];
        newSlots[slotToSwitch] = nextBrand;
        return newSlots;
      });
    }, 1600); //time switch intra-brand

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="w-full relative flex flex-col items-center justify-center text-center py-10 sm:py-16 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        html:not(.light) .partner-brand-logo {
          filter: brightness(0) invert(1);
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mb-10 sm:mb-14 px-4"
      >
        <span className="text-sm sm:text-base md:text-lg font-medium tracking-tight text-[var(--color-text-muted)]">
          {subheading}
        </span>
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[var(--color-text)] mt-1 sm:mt-2">
          {heading}
        </h2>
      </motion.div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 trusted-edge-fade">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center place-items-center">
          {activeBrands.map((brand, slotIndex) => (
            <div
              key={`slot-${slotIndex}`}
              className="h-[96px] sm:h-[110px] w-full flex items-center justify-center relative"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -22 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full flex items-center justify-center"
                >
                  {brand.isYourBrand ? (
                    <a
                      href="#contact"
                      className="flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-all cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-dashed border-[var(--color-border)] group-hover:border-[#1E40AF]/80 bg-[var(--color-surface)]/80 group-hover:bg-[#1E40AF]/15 transition-all shadow-xs">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-border)] group-hover:bg-[#1E40AF] group-hover:text-white text-[var(--color-text)] flex items-center justify-center text-xs font-bold transition-all">
                          +
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-text)] transition-colors whitespace-nowrap">
                          Your brand here
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono text-[var(--color-text-muted)] transition-opacity">
                        Partner with ANEXT
                      </span>
                    </a>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-center group hover:scale-105 transition-transform cursor-pointer select-none">
                      <img
                        src={brand.image}
                        alt={brand.name}
                        width="160"
                        height="56"
                        loading="eager"
                        decoding="async"
                        style={{ aspectRatio: "160 / 56" }}
                        className="partner-brand-logo h-10 sm:h-12 md:h-14 w-auto aspect-[160/56] object-contain max-w-[140px] sm:max-w-[160px] opacity-85 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-text)] transition-colors tracking-tight text-center max-w-[160px] sm:max-w-[180px] truncate">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandPartnersCarousel;
