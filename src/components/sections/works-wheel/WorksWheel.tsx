"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface WorksWheelItem {
  title: string;
  image?: string;
  img?: string;
  href?: string;
  category?: string;
  year?: string;
  description?: string;
  desc?: string;
  longdesc?: string;
  client?: string;
  tags?: string[];
  featured?: boolean;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  label?: string;
  action?: string;
}

const CARD_H = 0.44; 
const CARD_MAX_W = 0.38; 
const CARD_RATIO = 1.45; 
const STEP = 40; 
const DRUM = 2.22; 
const LENS = 2.7; 
const RING_R = 1.14; 
const BOW = 1.82; 
const TITLE = 0.124; 
const INDEX = 0.04; 
const CULL = 1.6;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Our Projects",
  action = "View",
  className,
  ...props
}: WorksWheelProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const pinRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const stageContentRef = React.useRef<HTMLDivElement>(null);
  const hudRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const metaRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLOListElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);
  const totalTurns = count + 2;

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardMaxWFactor = w < 640 ? 0.82 : w < 1024 ? 0.52 : CARD_MAX_W;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * cardMaxWFactor);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const bowFactor = w < 768 ? 1.1 : BOW;

    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;

    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * bowFactor,
      depth: cardH * LENS,
      title: Math.max(32, cardH * TITLE),
      index: Math.max(12, cardH * INDEX),
    };
  }, [stage, count]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : 0.14);

      const t = turn.current;

      let stageScale = 1;
      let stageOpacity = 1;

      if (t <= 1) {
        stageScale = lerp(0.55, 1, clamp(t, 0, 1));
        stageOpacity = clamp(t * 1.5, 0, 1);
      } else if (t > count + 1) {
        const leave = clamp(t - (count + 1), 0, 1);
        stageScale = lerp(1, 0.65, leave);
        stageOpacity = clamp(1 - leave, 0, 1);
      }

      if (stageContentRef.current) {
        stageContentRef.current.style.transform = `scale(${stageScale})`;
        stageContentRef.current.style.opacity = String(stageOpacity);
        stageContentRef.current.style.pointerEvents = stageOpacity > 0.1 ? "auto" : "none";
      }

      if (hudRef.current) {
        hudRef.current.style.transform = `scale(${stageScale})`;
        hudRef.current.style.opacity = String(stageOpacity);
        hudRef.current.style.pointerEvents = "none";
      }

      const m = clamp(t - 1, 0, 1);
      const pos = Math.max(0, t - 2);

      // Smooth horizontal shift when drum opens (m > 0) to provide a clear, balanced gap for the title
      const drumShiftX =
        stage.w >= 1024
          ? Math.min(stage.w * 0.13, 175)
          : stage.w >= 768
            ? Math.min(stage.w * 0.08, 70)
            : 0;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateX(${m * drumShiftX}px) translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) {
        const labelOp = clamp(1 - (t - 1) * 2.5, 0, 1);
        labelRef.current.style.opacity = String(labelOp);
        labelRef.current.style.pointerEvents = labelOp > 0.1 ? "auto" : "none";
      }

      if (titleRef.current) {
        let metaOp = clamp((t - 1.25) * 2.2, 0, 1);
        if (t > count + 1) {
          metaOp = clamp(1 - (t - (count + 1)) * 2, 0, 1);
        }
        titleRef.current.style.opacity = String(metaOp);
      }

      if (metaRef.current) {
        let metaOp = clamp((t - 1.25) * 2.2, 0, 1);
        if (t > count + 1) {
          metaOp = clamp(1 - (t - (count + 1)) * 2, 0, 1);
        }
        metaRef.current.style.opacity = String(metaOp);
      }

      if (listRef.current) {
        let listOp = clamp((t - 1.25) * 2.2, 0, 1);
        if (t > count + 1) {
          listOp = clamp(1 - (t - (count + 1)) * 2, 0, 1);
        }
        listRef.current.style.opacity = String(listOp);
        listRef.current.style.pointerEvents = listOp > 0.1 ? "auto" : "none";
        listRef.current.style.visibility = listOp > 0.001 ? "visible" : "hidden";
        listRef.current.style.zIndex = listOp > 0.001 ? "30" : "-1";
      }

      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, stage.w, count, last, reduced]);

  React.useEffect(() => {
    if (!trackRef.current || !pinRef.current) return;

    const snapPoints = Array.from(
      { length: totalTurns + 1 },
      (_, i) => i / totalTurns,
    );

    const ctx = gsap.context(() => {
      const pinTrigger = ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * totalTurns * 0.95}`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 0.6,
        snap: {
          snapTo: snapPoints,
          duration: { min: 0.25, max: 0.5 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          target.current = self.progress * totalTurns;
        },
      });

      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.on === "function") {
        lenis.on("scroll", ScrollTrigger.update);
      }

      return () => {
        if (lenis && typeof lenis.off === "function") {
          lenis.off("scroll", ScrollTrigger.update);
        }
        pinTrigger.kill();
      };
    });

    return () => ctx.revert();
  }, [count, totalTurns]);

  const to = React.useCallback(
    (index: number) => {
      const targetTurn = index + 2;
      if (trackRef.current) {
        const triggers = ScrollTrigger.getAll();
        const trigger = triggers.find((t) => t.trigger === trackRef.current);
        if (trigger) {
          const targetProgress = targetTurn / totalTurns;
          const targetY =
            trigger.start + targetProgress * (trigger.end - trigger.start);
          window.scrollTo({ top: targetY, behavior: "smooth" });
          return;
        }
      }
      target.current = clamp(targetTurn, 0, totalTurns);
    },
    [totalTurns],
  );

  return (
    <div
      ref={trackRef}
      className={cn("w-full relative overflow-x-clip", className)}
      {...props}
    >
      <div
        ref={pinRef}
        className="w-full h-screen flex items-center justify-center relative overflow-hidden select-none text-[var(--color-text)] transition-colors duration-300"
      >
        {/* Subtle Atmospheric Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-blue-500/[0.03] dark:bg-[#1E40AF]/10 rounded-full blur-[150px]" />
        </div>

        {/* 3D Wheel Stage with Perspective (Only 3D cards live here) */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`works-wheel-${active}`}
          className="relative w-full h-full outline-none overflow-hidden select-none z-10"
          style={{ perspective: `${metrics.depth}px` }}
        >
          {/* Stage Content Wrapper */}
          <div
            ref={stageContentRef}
            className="w-full h-full relative [transform-style:preserve-3d]"
            style={{ opacity: 0, transform: "scale(0.55)" }}
          >
            {/* 3D Drum Wheel */}
            <div
              ref={wheelRef}
              className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
            >
              {items.map((item, i) => {
                const Tag = (item.href ? "a" : "div") as "a";
                return (
                  <React.Fragment key={item.title}>
                    <Tag
                      id={`works-wheel-${i}`}
                      role="option"
                      aria-selected={i === active}
                      href={item.href}
                      ref={(node: HTMLElement | null) => {
                        cardRefs.current[i] = node;
                      }}
                      className="group absolute [backface-visibility:hidden] cursor-pointer"
                      style={{
                        width: metrics.cardW,
                        height: metrics.cardH,
                        marginLeft: -metrics.cardW / 2,
                        marginTop: -metrics.cardH / 2,
                      }}
                      onClick={(e) => {
                        if (turn.current <= 1.2 || i !== active) {
                          e.preventDefault();
                          to(i);
                        }
                      }}
                    >
                      <span className="relative block size-full overflow-hidden rounded-xl sm:rounded-2xl border wheel-card-bg shadow-[0_20px_50px_-15px_rgba(0,0,0,0.12)] dark:shadow-2xl transition-all duration-300 group-hover:border-slate-400 dark:group-hover:border-white/30">
                        <img
                          src={item.image || item.img || ""}
                          alt={item.title}
                          draggable={false}
                          className="size-full object-cover"
                        />

                        {action && item.href ? (
                          <span className="bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono opacity-0 backdrop-blur-md transition group-hover:translate-y-0 group-hover:opacity-100 shadow-md">
                            <svg
                              viewBox="0 0 12 12"
                              className="size-2.5 text-[var(--color-text)]"
                              aria-hidden="true"
                            >
                              <path
                                d="M3 9 9 3M4 3h5v5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {action}
                          </span>
                        ) : null}
                      </span>
                    </Tag>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2D HUD Overlay: Completely separate layer at z-30, immune to 3D perspective distortion */}
        <div
          ref={hudRef}
          className="pointer-events-none absolute inset-0 z-30 select-none overflow-hidden"
          style={{ opacity: 0, transform: "scale(0.55)" }}
        >
          {/* Center Title at Idle Ring (t <= 1) */}
          <div
            ref={labelRef}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-300"
          >
            <span className="text-xs font-mono uppercase tracking-widest wheel-muted mb-2 font-medium">
              Selected Works
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight wheel-title select-none drop-shadow-none">
              {label}
            </h2>
            <p className="mt-3 text-xs sm:text-sm font-mono wheel-muted max-w-sm mx-auto select-none">
              We build systems that grow with you.
            </p>
          </div>

          {/* Left Title & Metadata: Category, Title, Desc - GUARANTEED FOREGROUND & CLEAR DISTANCE */}
          <div
            ref={titleRef}
            className="pointer-events-none absolute top-1/2 left-[4%] sm:left-[5%] lg:left-[6%] -translate-y-1/2 tracking-tight opacity-0 max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] leading-tight transition-all duration-300"
          >
            {items[active] && (
              <div>
                {items[active].category && (
                  <div className="text-xs sm:text-sm font-mono uppercase tracking-widest wheel-muted font-semibold mb-2">
                    {items[active].category}
                  </div>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold wheel-title tracking-tight leading-[1.08] mb-3 drop-shadow-none dark:drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
                  {items[active].title}
                </h2>
                {(items[active].desc || items[active].description) && (
                  <p className="text-xs sm:text-sm font-mono wheel-muted line-clamp-3 leading-relaxed max-w-[360px]">
                    {items[active].desc || items[active].description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Right Metadata: Year & Tags */}
          <div
            ref={metaRef}
            className="pointer-events-none absolute bottom-[8%] sm:bottom-[10%] right-6 sm:right-8 md:right-10 lg:right-12 opacity-0 flex flex-col items-end text-right max-w-xs transition-all duration-300"
          >
            {items[active] && (
              <div className="space-y-2.5">
                {items[active].year && (
                  <div className="text-xs sm:text-sm font-mono uppercase tracking-widest wheel-muted font-semibold">
                    {items[active].year}
                  </div>
                )}
                {items[active].tags && items[active].tags.length > 0 && (
                  <div className="flex flex-wrap justify-end gap-1.5 max-w-[240px]">
                    {items[active].tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[11px] font-mono wheel-tag backdrop-blur-md shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Top Right Quick Project List Index */}
          <ol
            ref={listRef}
            className="pointer-events-none absolute top-[8%] sm:top-[10%] right-6 sm:right-8 md:right-10 lg:right-12 text-right leading-[1.85] font-mono select-none space-y-0.5 max-w-[200px] sm:max-w-[240px] transition-opacity duration-300 opacity-0 -z-10"
            style={{ fontSize: metrics.index, visibility: "hidden" }}
          >
            {items.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => to(i)}
                  className={cn(
                    "wheel-quick-item cursor-pointer transition-colors outline-none block ml-auto truncate max-w-full text-right",
                    i === active && "active font-bold drop-shadow-none",
                  )}
                  title={item.title}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default WorksWheel;
