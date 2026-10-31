"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: any;
};

const CharacterV1: React.FC<CharacterProps> = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(
    scrollYProgress,
    [0, 0.65],
    [distanceFromCenter * 45, 0]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.65],
    [distanceFromCenter * 20, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.65],
    [0.1, 0.5, 1]
  );

  return (
    <motion.span
      className={cn(
        "inline-block font-sans font-bold uppercase tracking-tight text-[var(--color-text)] will-change-transform select-none",
        isSpace && "w-3 sm:w-6 md:w-8"
      )}
      style={{
        x,
        rotateX,
        opacity,
      }}
    >
      {char}
    </motion.span>
  );
};

export const Bracket: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={cn("h-10 text-[var(--color-text)] opacity-80", className)}
    >
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      />
    </svg>
  );
};

export interface AnimatedCtaTextProps {
  text?: string;
  subtext?: string;
  eyebrow?: string;
  className?: string;
}

export type Skiper31Props = AnimatedCtaTextProps;

const AnimatedCtaText: React.FC<AnimatedCtaTextProps> = ({
  text = "EXPLORE WHAT'S NEXT",
  subtext = "Explore how ANEXT can engineer, and discover to help you scale faster with greater confidence.",
  eyebrow = "EXPLORE",
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
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

  const totalLength = text.length;
  const centerIndex = Math.floor(totalLength / 2);

  const subtextOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const subtextY = useTransform(scrollYProgress, [0.35, 0.65], [20, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const words = text.split(" ");
  let runningCharIndex = 0;

  return (
    <section
      id="explore"
      ref={targetRef}
      className={cn(
        "relative w-full h-[180vh] bg-[var(--color-bg)] text-[var(--color-text)] overflow-clip",
        className
      )}
    >
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 text-center pointer-events-none transition-opacity"
      >
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text)] font-medium px-3.5 py-1 rounded-full border border-[var(--color-border)] bg-white/[0.03] backdrop-blur-sm">
          &#123;&nbsp;{eyebrow}&nbsp;&#125;
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-text-muted)] opacity-70 leading-tight">
          Scroll to reveal
        </span>
      </motion.div>

      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8 py-12"
        style={{
          perspective: "600px",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(30,64,175,0.12),transparent_70%)]"
        />

        <div
          className="w-full max-w-6xl mx-auto text-center flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-6 text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter"
          style={{
            perspective: "500px",
            transformStyle: "preserve-3d",
          }}
        >
          {words.map((word, wIdx) => {
            const wordChars = word.split("");
            const startIndex = runningCharIndex;
            runningCharIndex += wordChars.length + 1;

            return (
              <span key={wIdx} className="inline-flex whitespace-nowrap">
                {wordChars.map((char, cIdx) => {
                  const charIdx = startIndex + cIdx;
                  if (prefersReducedMotion) {
                    return (
                      <span
                        key={cIdx}
                        className="inline-block font-sans font-bold uppercase tracking-tight text-[var(--color-text)] select-none"
                      >
                        {char}
                      </span>
                    );
                  }
                  return (
                    <CharacterV1
                      key={cIdx}
                      char={char}
                      index={charIdx}
                      centerIndex={centerIndex}
                      scrollYProgress={scrollYProgress}
                    />
                  );
                })}
              </span>
            );
          })}
        </div>

        <motion.div
          style={{
            opacity: prefersReducedMotion ? 1 : subtextOpacity,
            y: prefersReducedMotion ? 0 : subtextY,
          }}
          className="mt-8 sm:mt-12 text-center max-w-2xl mx-auto flex flex-col items-center px-4"
        >
          <p className="font-mono text-xs sm:text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed font-light">
            {subtext}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@anext.dev?subject=Schedule%20a%20Call"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-semibold text-xs sm:text-sm tracking-wide transition-all hover:scale-105 shadow-lg"
            >
              Schedule a Call
            </a>
            <a
              href="mailto:hello@anext.dev?subject=Project%20Inquiry"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-semibold text-xs sm:text-sm tracking-wide transition-all hover:scale-105 shadow-lg"
            >
              Send a Message
            </a>
          </div>
          <p className="mt-4 font-mono text-xs sm:text-sm text-[var(--color-text-muted)] text-center">
            Or reach out directly at{" "}
            <a
              href="mailto:hello@anext.dev"
              className="text-[var(--color-text)] underline underline-offset-4 hover:opacity-80 transition-opacity font-medium"
            >
              hello@anext.dev
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export { CharacterV1, AnimatedCtaText, AnimatedCtaText as Skiper31 };
export default AnimatedCtaText;
