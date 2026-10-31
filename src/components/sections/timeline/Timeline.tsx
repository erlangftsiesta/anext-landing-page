"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface JourneyItem {
  id: string;
  year: string;
  month: string;
  content: string;
  position: "top" | "bottom";
}

export interface TimelineProps {
  title?: string;
  periodLabel?: string;
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
}

const allJourneyItems: JourneyItem[] = [
  {
    id: "2020-march",
    year: "2020",
    month: "March",
    content: "Founded by senior engineers to bridge strategy and resilient distributed architectures",
    position: "top",
  },
  {
    id: "2021-july",
    year: "2021",
    month: "July",
    content: "Designed high-availability clusters and secure cloud infrastructure for enterprise partners",
    position: "bottom",
  },
  {
    id: "2022-october",
    year: "2022",
    month: "October",
    content: "Expanded into high-throughput application platforms, modern web apps, and telemetry",
    position: "top",
  },
  {
    id: "2023-april",
    year: "2023",
    month: "April",
    content: "Instituted comprehensive penetration testing, zero-trust cloud security, and CI/CD automation",
    position: "bottom",
  },
  {
    id: "2024-september",
    year: "2024",
    month: "September",
    content: "Enduring enterprise partnerships powering scalable APIs and mission-critical workloads",
    position: "top",
  },
  {
    id: "2025-may",
    year: "2025",
    month: "May",
    content: "Global distributed capabilities delivering resilient solutions that grow with modern teams",
    position: "bottom",
  },
  {
    id: "2026-october",
    year: "2026",
    month: "October",
    content: "Next-gen digital systems engineered for autonomous durability, resilience, and scale",
    position: "top",
  },
];

export default function Timeline({
  title = "Why ANEXT Exists",
  periodLabel = "2020 — 2026",
  imageUrl = "/images/about-timeline.jpg",
  imageAlt = "ANEXT engineering workspace",
  className,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const wholeSliderRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  const branchLinesRef = useRef<Record<string, HTMLDivElement | null>>({});
  const dotsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const contentsRef = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const slider = wholeSliderRef.current;
      if (!slider) return;

      if (reduced) {
        if (lineRef.current) lineRef.current.style.width = "100%";
        return;
      }

      // Initial state
      if (lineRef.current) gsap.set(lineRef.current, { width: "0%" });

      allJourneyItems.forEach((item, idx) => {
        const branch = branchLinesRef.current[item.id];
        const dot = dotsRef.current[item.id];
        const content = contentsRef.current[item.id];

        if (idx === 0) {
          if (branch) gsap.set(branch, { scaleY: 1 });
          if (dot) gsap.set(dot, { scale: 1, opacity: 1 });
          if (content) gsap.set(content, { opacity: 1, y: 0 });
        } else {
          if (branch) gsap.set(branch, { scaleY: 0 });
          if (dot) gsap.set(dot, { scale: 0, opacity: 0 });
          if (content) gsap.set(content, { opacity: 0, y: 12 });
        }
      });

      const getScrollDist = () => {
        if (!slider) return 0;
        const lastItem = lastItemRef.current;
        if (lastItem) {
          const currentX = (gsap.getProperty(slider, "x") as number) || 0;
          const sliderLeft = slider.getBoundingClientRect().left - currentX;
          const lastItemLeft = lastItem.getBoundingClientRect().left - currentX;
          const lastItemCenter = (lastItemLeft - sliderLeft) + lastItem.offsetWidth / 2;
          const targetDist = lastItemCenter - window.innerWidth / 2;
          return Math.max(0, targetDist);
        }
        return Math.max(0, slider.scrollWidth - window.innerWidth);
      };

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 4.2, getScrollDist() * 1.5)}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      masterTl.to(
        slider,
        {
          x: () => -getScrollDist(),
          ease: "none",
          duration: 1,
        },
        0
      );

      if (lineRef.current) {
        masterTl.to(
          lineRef.current,
          {
            width: "100%",
            ease: "none",
            duration: 1,
          },
          0
        );
      }

      allJourneyItems.forEach((item, idx) => {
        if (idx === 0) return;

        const isLast = idx === allJourneyItems.length - 1;
        const t = isLast ? 0.94 : 0.08 + (idx / (allJourneyItems.length - 1)) * 0.84;

        const branch = branchLinesRef.current[item.id];
        const dot = dotsRef.current[item.id];
        const content = contentsRef.current[item.id];

        if (branch) {
          masterTl.to(
            branch,
            { scaleY: 1, duration: 0.035, ease: "power2.out" },
            Math.max(0, t - 0.015)
          );
        }

        if (dot) {
          masterTl.to(
            dot,
            { scale: 1, opacity: 1, duration: 0.025, ease: "back.out(2)" },
            t
          );
        }

        if (content) {
          masterTl.to(
            content,
            { opacity: 1, y: 0, duration: 0.03, ease: "power2.out" },
            t
          );
        }
      });

      masterTl.to({}, { duration: 0.4 }, 1);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="Our Journey and Company Milestones"
      className={cn(
        "relative w-full bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden",
        className
      )}
    >
      <h2 className="sr-only">Our Journey and Company Milestones</h2>
      <span id="journey" className="absolute -top-24" />

      <div className="h-screen w-full flex items-center overflow-hidden py-8">
        <div
          ref={wholeSliderRef}
          style={{ paddingRight: "max(75vw, 520px)" }}
          className="flex h-[82vh] max-h-[700px] items-center gap-8 sm:gap-16 px-4 sm:px-12 will-change-transform shrink-0 w-max"
        >
          <div className="h-full w-[24vw] min-w-[220px] sm:min-w-[280px] max-w-[380px] shrink-0 overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-2xl relative">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover filter brightness-95 hover:brightness-100 transition-all duration-500"
            />
          </div>

          <div className="relative h-full flex items-center shrink-0">
            <div className="w-full absolute left-0 top-1/2 -translate-y-1/2 h-fit pointer-events-none z-10">
              <div className="w-full h-[2px] bg-[var(--color-border)] opacity-60 absolute left-0 top-1/2 -translate-y-1/2" />

              <div
                ref={lineRef}
                className="h-[2px] bg-[var(--color-text)] absolute left-0 top-1/2 -translate-y-1/2 shadow-sm"
              />

              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-text)] absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1" />

              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)] absolute right-0 top-1/2 -translate-y-1/2 translate-x-1" />
            </div>

            <div className="h-full w-[20vw] min-w-[190px] sm:min-w-[220px] max-w-[320px] shrink-0 pr-4 sm:pr-8 flex flex-col justify-between py-6 z-20">
              <div className="h-1/2 flex items-end pb-8">
                <h2 className="font-sans font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight leading-[1.08] text-[var(--color-text)]">
                  {title}
                </h2>
              </div>
              <div className="h-1/2 flex items-start pt-8">
                <p className="font-mono font-medium text-xs sm:text-base tracking-widest uppercase text-[var(--color-text)] opacity-80">
                  {periodLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-x-10 sm:gap-x-24 md:gap-x-32 lg:gap-x-40 h-full pl-4 sm:pl-6">
              {allJourneyItems.map((item, idx) => {
                const isTop = item.position === "top";
                const isLast = idx === allJourneyItems.length - 1;

                return (
                  <div
                    key={item.id}
                    ref={isLast ? lastItemRef : undefined}
                    className="relative w-[260px] sm:w-[320px] md:w-[360px] lg:w-[400px] shrink-0 h-full flex flex-col justify-between"
                  >
                    <div className="h-1/2 flex flex-col justify-end pb-8 relative">
                      {isTop && (
                        <div className="relative">
                          <div className="absolute left-0 bottom-[-32px] top-0 w-px pointer-events-none">
                            <div
                              ref={(el) => {
                                branchLinesRef.current[item.id] = el;
                              }}
                              className="w-full h-full bg-[var(--color-text)] origin-bottom"
                            />
                            <div
                              ref={(el) => {
                                dotsRef.current[item.id] = el;
                              }}
                              className="w-2.5 h-2.5 -translate-x-[4px] -translate-y-1 rounded-full bg-[var(--color-text)] absolute top-0"
                            />
                          </div>

                          <div
                            ref={(el) => {
                              contentsRef.current[item.id] = el;
                            }}
                            className="pl-6 space-y-2"
                          >
                            <h3 className="font-sans font-bold text-xl sm:text-2xl md:text-3xl tracking-tight text-[var(--color-text)]">
                              {item.year}{" "}
                              <span className="font-mono text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">
                                {item.month}
                              </span>
                            </h3>
                            <p className="font-mono text-xs sm:text-sm text-[var(--color-text)] leading-relaxed font-normal">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="h-1/2 flex flex-col justify-start pt-8 relative">
                      {!isTop && (
                        <div className="relative">
                          <div className="absolute left-0 top-[-32px] bottom-0 w-px pointer-events-none">
                            <div
                              ref={(el) => {
                                branchLinesRef.current[item.id] = el;
                              }}
                              className="w-full h-full bg-[var(--color-text)] origin-top"
                            />
                            <div
                              ref={(el) => {
                                dotsRef.current[item.id] = el;
                              }}
                              className="w-2.5 h-2.5 -translate-x-[4px] translate-y-1 rounded-full bg-[var(--color-text)] absolute bottom-0"
                            />
                          </div>

                          <div
                            ref={(el) => {
                              contentsRef.current[item.id] = el;
                            }}
                            className="pl-6 space-y-2"
                          >
                            <h3 className="font-sans font-bold text-xl sm:text-2xl md:text-3xl tracking-tight text-[var(--color-text)]">
                              {item.year}{" "}
                              <span className="font-mono text-xs sm:text-sm font-medium text-[var(--color-text-muted)]">
                                {item.month}
                              </span>
                            </h3>
                            <p className="font-mono text-xs sm:text-sm text-[var(--color-text)] leading-relaxed font-normal">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Timeline };
