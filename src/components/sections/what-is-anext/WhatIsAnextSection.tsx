"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import React, { useRef, useState, useEffect } from "react";

interface Skiper28Props {
  heading?: string;
  body?: string;
  eyebrow?: string;
}

const WhatIsAnextSection: React.FC<Skiper28Props> = ({
  heading = "We build systems that grow with you.",
  body = "At ANEXT, we work closely with your team, listening to your needs and supporting you every step of the way. From infrastructure to applications, we engineer robust digital solutions designed for durability, resilience, and scale.",
  eyebrow = "WHAT'S ANEXT",
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) =>
        setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const yMotionValue = useTransform(scrollYProgress, [0, 1], [487, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6, 1],
    [0.55, 0.85, 0.98, 1]
  );

  const bottomMaskOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.75, 1],
    [0.9, 0.6, 0.25, 0.08]
  );

  const transform = useMotionTemplate`rotateX(${prefersReducedMotion ? 0 : 30}deg) translateY(${prefersReducedMotion ? 0 : yMotionValue}px) translateZ(10px)`;

  return (
    <section
      id="what-is-anext"
      ref={targetRef}
      className="relative z-0 h-[300vh] w-full bg-transparent text-[var(--color-text)] overflow-clip"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(30,64,175,0.14),transparent_70%)]"
      />

      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute left-1/2 top-[8%] sm:top-[10%] -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-center pointer-events-none transition-opacity"
      >
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text)] font-medium px-3.5 py-1 rounded-full border border-[var(--color-border)] bg-white/[0.03] backdrop-blur-sm">
          &#123;&nbsp;{eyebrow}&nbsp;&#125;
        </div>
        <span className="relative max-w-[14ch] font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] opacity-70 leading-tight after:absolute after:left-1/2 after:top-full after:mt-3 after:h-12 after:w-px after:-translate-x-1/2 after:bg-gradient-to-b after:from-[#1E40AF] after:to-transparent after:content-['']">
          scroll down to see
        </span>
      </motion.div>

      <div
        className="sticky top-0 mx-auto flex h-screen w-full items-center justify-center bg-transparent py-20 px-4 sm:px-6 md:px-8 overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          perspective: "240px",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 h-[20vh] w-full bg-gradient-to-t from-transparent via-[var(--color-bg)]/80 to-[var(--color-bg)] z-10"
        />

        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transform,
            opacity: contentOpacity,
          }}
          className="w-full max-w-4xl mx-auto text-center flex flex-col items-center px-4"
        >
          <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[var(--color-text)] opacity-100 leading-[1.12]">
            {heading}
          </h2>

          <p className="font-mono text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-[var(--color-text)]/90 opacity-95 sm:opacity-100 mt-6 sm:mt-8 max-w-2xl font-light">
            {body}
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: bottomMaskOpacity }}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[42vh] sm:h-[50vh] w-full bg-gradient-to-b from-transparent via-[var(--color-bg)]/85 to-[var(--color-bg)] z-10"
        />
      </div>
    </section>
  );
};

export { WhatIsAnextSection, WhatIsAnextSection as Skiper28 };
export default WhatIsAnextSection;
