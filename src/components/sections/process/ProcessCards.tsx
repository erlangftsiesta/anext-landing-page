"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ProcessCardItem {
  title: string;
  description: string;
}

export interface ProcessServiceCardData {
  title: string;
  description: string;
  icon: React.ReactNode;
  cardItems: ProcessCardItem[];
}

export const METHODOLOGY_CARDS: ProcessServiceCardData[] = [
  {
    title: "Discovery",
    description:
      "Business goals and technical needs analysis to ensure full architectural clarity.",
    icon: (
      <svg
        className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--color-text)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    ),
    cardItems: [
      {
        title: "Stakeholder Alignment",
        description:
          "Uncovering core business objectives, key success metrics, and user expectations.",
      },
      {
        title: "Architecture Audit",
        description:
          "Evaluating technical feasibility, legacy infrastructure, and potential bottlenecks.",
      },
      {
        title: "Project Roadmap",
        description:
          "Establishing technical milestones, team velocity, and risk mitigation strategies.",
      },
    ],
  },
  {
    title: "Design",
    description:
      "System design, cloud blueprints, and scalability planning for high durability.",
    icon: (
      <svg
        className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--color-text)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693l-1.57-.393m15.6 0l1.17 4.68a1.5 1.5 0 01-1.455 1.863H4.485a1.5 1.5 0 01-1.455-1.863l1.17-4.68"
        />
      </svg>
    ),
    cardItems: [
      {
        title: "Scalability Blueprints",
        description:
          "Architecting modular, decoupled components engineered to handle exponential traffic.",
      },
      {
        title: "API Contracts & Schemas",
        description:
          "Defining robust data protocols, REST/gRPC interfaces, and database schemas.",
      },
      {
        title: "Interactive Prototyping",
        description:
          "Validating structural workflows and user interaction patterns before writing code.",
      },
    ],
  },
  {
    title: "Development",
    description:
      "Clean, maintainable implementation with automated test coverage and fast feedback.",
    icon: (
      <svg
        className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--color-text)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      </svg>
    ),
    cardItems: [
      {
        title: "Clean Architecture",
        description:
          "Adhering to strict domain-driven patterns, type safety, and modular maintainability.",
      },
      {
        title: "Automated CI/CD",
        description:
          "Continuous integration pipelines with automated linters, checks, and unit tests.",
      },
      {
        title: "Rapid Iteration",
        description:
          "Sprint-based delivery cycles with transparent engineering progress and continuous demos.",
      },
    ],
  },
  {
    title: "Testing",
    description:
      "Reliability validation, security audits, and penetration testing before release.",
    icon: (
      <svg
        className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--color-text)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    cardItems: [
      {
        title: "Zero-Regression QA",
        description:
          "Comprehensive automated test suites covering edge cases, unit, and end-to-end flows.",
      },
      {
        title: "Security Hardening",
        description:
          "Vulnerability audits, penetration testing, and compliance validation at every layer.",
      },
      {
        title: "Load Simulations",
        description:
          "Benchmarking performance under extreme simulated traffic surges and concurrency.",
      },
    ],
  },
  {
    title: "Deployment",
    description:
      "Stable zero-downtime release pipelines, container rollouts, and infrastructure verification.",
    icon: (
      <svg
        className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--color-text)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7a14.93 14.93 0 01-2.7-2.7"
        />
      </svg>
    ),
    cardItems: [
      {
        title: "Zero-Downtime Rollout",
        description:
          "Seamless canary deployments and blue-green releases with instant rollback safety.",
      },
      {
        title: "Infrastructure as Code",
        description:
          "Fully reproducible cloud environments provisioned via modern IaC pipelines.",
      },
      {
        title: "Multi-Zone Resilience",
        description:
          "Redundant containerized deployments across distributed availability zones.",
      },
    ],
  },
  {
    title: "Support & Maintenance",
    description:
      "Long-term proactive maintenance, cloud cost optimization, and 24/7 reliability support.",
    icon: (
      <svg
        className="w-20 h-20 sm:w-28 sm:h-28 text-[var(--color-text)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.25"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.67 2.67 0 0021 17.25l-5.83-5.83m-3.75 3.75a5.971 5.971 0 01-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    ),
    cardItems: [
      {
        title: "24/7 Telemetry",
        description:
          "Distributed telemetry, real-time alerting, and rapid incident response coverage.",
      },
      {
        title: "Continuous Optimization",
        description:
          "Iterative performance tuning, query optimization, and ongoing cloud cost efficiency.",
      },
      {
        title: "Long-term Scaling",
        description:
          "Scaling system capabilities and upgrading infrastructure as your business expands.",
      },
    ],
  },
];

const CardBottomColumns: React.FC<{ items: ProcessCardItem[] }> = ({ items }) => {
  const [activeItem, setActiveItem] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % items.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [items.length, isHovered]);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 pt-6 sm:pt-8 border-t border-[var(--color-border)] text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {items.map((item, idx) => {
        const isActive = activeItem === idx;
        return (
          <div
            key={idx}
            onClick={() => setActiveItem(idx)}
            onMouseEnter={() => setActiveItem(idx)}
            className={cn(
              "cursor-pointer flex flex-col justify-between transition-opacity duration-300 select-none",
              isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
            )}
          >
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-[var(--color-text)] tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-light">
                {item.description}
              </p>
            </div>

            <div className="mt-4 h-[2px] w-full bg-[var(--color-border)] rounded-full overflow-hidden relative">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isActive
                    ? "w-full bg-[var(--color-text)]"
                    : "w-0 bg-transparent"
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export interface StickyCard002Props {
  cards?: ProcessServiceCardData[];
  className?: string;
}

const StickyCard002: React.FC<StickyCard002Props> = ({
  cards = METHODOLOGY_CARDS,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current || !stickyRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cardElements = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const totalCards = cardElements.length;

      if (!cardElements[0] || totalCards <= 1) return;

      gsap.set(cardElements[0], {
        y: "0%",
        scale: 1,
        rotation: 0,
        opacity: 1,
        pointerEvents: "auto",
      });

      for (let i = 1; i < totalCards; i++) {
        if (!cardElements[i]) continue;
        const initialRot = i % 2 === 0 ? -3 : 3;
        gsap.set(cardElements[i], {
          y: "100%",
          scale: 0.96,
          rotation: initialRot,
          opacity: 0,
          pointerEvents: "none",
        });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (totalCards - 1) * 1.15}`,
          pin: stickyRef.current,
          scrub: 0.6,
          pinSpacing: true,
          snap: {
            snapTo: 1 / (totalCards - 1),
            duration: { min: 0.25, max: 0.55 },
            delay: 0.08,
            ease: "power2.inOut",
          },
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;
        if (!currentCard || !nextCard) continue;

        const exitRot = i % 2 === 0 ? 4 : -4;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.88,
            y: "-15%",
            rotation: exitRot,
            opacity: 0,
            pointerEvents: "none",
            duration: 1,
            ease: "power2.inOut",
          },
          position,
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            scale: 1,
            rotation: 0,
            opacity: 1,
            pointerEvents: "auto",
            duration: 1,
            ease: "power2.inOut",
          },
          position,
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full bg-[var(--color-bg)] text-[var(--color-text)]", className)}
    >
      <span id="process" className="absolute -top-24" />
      <span id="methodology" className="absolute -top-24" />

      <div
        ref={stickyRef}
        className="sticky-cards relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-center">
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                zIndex: i + 1,
                transformOrigin: "center center",
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "none" : "translate3d(0, 100%, 0) scale(0.96)",
                pointerEvents: i === 0 ? "auto" : "none",
              }}
              className="absolute inset-0 w-full h-full flex flex-col justify-between py-10 sm:py-14 md:py-16 px-4 sm:px-8 md:px-12 will-change-transform"
            >
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[var(--color-text)] mb-3">
                  {card.title}
                </h2>
                <p className="font-mono text-xs sm:text-sm md:text-base text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed font-light">
                  {card.description}
                </p>
              </div>

              <div className="my-auto py-8 sm:py-16 flex items-center justify-center w-full">
                <div className="text-[var(--color-text)] transition-transform duration-500 hover:scale-110 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              <CardBottomColumns items={card.cardItems} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProcessCards: React.FC<StickyCard002Props> = (props) => {
  return (
    <div className="h-full w-full">
      <StickyCard002 {...props} />
    </div>
  );
};

export { ProcessCards, StickyCard002, ProcessCards as Skiper17 };
export default ProcessCards;
