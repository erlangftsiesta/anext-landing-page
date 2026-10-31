import { type EmblaCarouselType, type EmblaEventType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { gsap } from "gsap";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useMediaQuery from "@/lib/use-media-query";
import { debounce } from "@/lib/debounce";
import { BlurIn } from "../../animations/blur-in";
import LightRays from "../../animations/light-rays";
import classes from "./feature-cards.module.css";

interface CardMetadata {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeatureCardsProps {
  containerHeight?: number;
  className?: string;
  cards: CardMetadata[];
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
  duration?: number;
}

export default function FeatureCards({
  className = "",
  cards = [],
  containerHeight = 440,
  duration = 0.4,
  enableHover = false,
}: FeatureCardsProps) {
  const isMobile = useMediaQuery("(max-width: 1080px)");
  const [emblaRef, embla] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 2500 }),
  ]);
  const [selectedSnap, setSelectedSnap] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const DEFAULT_TRANSFORM_STYLES = [
    "rotate(-5deg) translate(-500px)",
    "rotate(0deg) translate(-360px)",
    "rotate(5deg) translate(-220px)",
    "rotate(-3deg) translate(-80px)",
    "rotate(0deg) translate(60px)",
    "rotate(3deg) translate(200px)",
    "rotate(-5deg) translate(340px)",
    "rotate(0deg) translate(480px)",
  ];
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [transformStyles, setTransformStyles] = useState<string[]>(
    DEFAULT_TRANSFORM_STYLES,
  );
  const DEFAULT_HOVERED_IDX = null;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(
    DEFAULT_HOVERED_IDX,
  );
  const lightRaysRef = useRef<HTMLDivElement>(null);
  const cardHostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardHostRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      const width = window.innerWidth;
      setContainerWidth(width);

      const styles: string[] = [];
      const centerIdx = (cards.length - 1) / 2;
      const safeWidth = Math.min(width, 1400);
      const maxHalfSpan = (safeWidth - 100) / 2 - 175;
      const spacing = Math.max(
        90,
        Math.min(135, Math.floor(maxHalfSpan / centerIdx)),
      );

      const rotations = [0, -4, 4, -2, 2, -3, 3];
      cards.forEach((_, i) => {
        const offsetFromCenter = i - centerIdx;
        const rotation =
          rotations[Math.abs(Math.round(offsetFromCenter)) % rotations.length];
        const translationX = offsetFromCenter * spacing;
        styles.push(`rotate(${rotation}deg) translate(${translationX}px)`);
      });

      setTransformStyles(styles);
    };
    handleResize();

    const debouncedHandleResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, [cards.length]);

  const getNoRotationTransform = (transformStr: string): string => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    } else if (transformStr === "none") {
      return "rotate(0deg)";
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  };

  const getPushedTransform = (
    baseTransform: string,
    offsetX: number,
  ): string => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === "none"
        ? `translate(${offsetX}px)`
        : `${baseTransform} translate(${offsetX}px)`;
    }
  };

  const pushSiblings = (idx: number) => {
    if (!enableHover) {
      return;
    }

    setHoveredIdx(idx);

    cards.forEach((_, i) => {
      const selector = `.card-${i}`;
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || "none";

      if (i === idx) {
        const noRotation = getNoRotationTransform(baseTransform);
        gsap.to(selector, {
          transform: noRotation,
          duration,
          ease: "back.out(1.4)",
          overwrite: "auto",
          zIndex: 50,
        });

        const host = cardHostRefs.current[idx];
        if (lightRaysRef.current && host) {
          gsap.killTweensOf(lightRaysRef.current);
          host.appendChild(lightRaysRef.current);
          gsap.to(lightRaysRef.current, {
            opacity: 0.7,
            duration: duration * 0.5,
            overwrite: "auto",
          });
        }
      } else {
        const offsetX = i < idx ? -115 : 115;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);

        const distance = Math.abs(idx - i);
        const delay = distance * 0.04;

        gsap.to(selector, {
          transform: pushedTransform,
          duration,
          ease: "back.out(1.4)",
          delay,
          overwrite: "auto",
          zIndex: i + 1,
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover) {
      return;
    }
    setHoveredIdx(DEFAULT_HOVERED_IDX);

    if (lightRaysRef.current) {
      gsap.to(lightRaysRef.current, {
        opacity: 0,
        duration: duration * 0.5,
        overwrite: "auto",
      });
    }

    cards.forEach((_, i) => {
      const selector = `.card-${i}`;
      gsap.killTweensOf(selector);

      const baseTransform = transformStyles[i] || "none";
      gsap.to(selector, {
        transform: baseTransform,
        duration,
        ease: "back.out(1.4)",
        overwrite: "auto",
        zIndex: i + 1,
      });
    });
  };

  const scrollPrev = () => embla && embla.scrollPrev();
  const scrollNext = () => embla && embla.scrollNext();

  const onSelect = (emblaApi: EmblaCarouselType, evt: EmblaEventType) => {
    if (!embla) {
      return;
    }
    const selectedIndex = emblaApi.selectedScrollSnap();
    setHoveredIdx(selectedIndex);

    const host = mobileCardHostRefs.current[selectedIndex];
    if (lightRaysRef.current && host) {
      gsap.killTweensOf(lightRaysRef.current);
      host.appendChild(lightRaysRef.current);
      gsap.to(lightRaysRef.current, {
        opacity: 0.7,
        duration: duration * 0.5,
        overwrite: "auto",
      });
    }

    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
    setSelectedSnap(selectedIndex);
    setSnapCount(embla.scrollSnapList().length);
  };

  useEffect(() => {
    if (!embla) {
      return;
    }
    if (!isMobile) {
      return;
    }
    embla.on("select", onSelect);
    onSelect(embla, null as any);
  }, [embla, isMobile]);

  return (
    <div
      className={`relative w-full flex items-center justify-center ${className}`}
    >
      {/* Desktop Stacked Cards (> 1080px) */}
      <div
        className="hidden min-[1081px]:flex items-center justify-center relative"
        style={{
          width: containerWidth ?? "100%",
          height: containerHeight,
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${classes.card} card-${idx} absolute w-[350px] aspect-square overflow-hidden text-center`}
            style={{
              transform: transformStyles[idx] || "none",
              zIndex: hoveredIdx === idx ? 50 : idx + 1,
            }}
            onMouseEnter={() => pushSiblings(idx)}
            onMouseLeave={resetSiblings}
          >
            <BlurIn
              className="flex w-full h-full"
              delay={idx * 0.08}
              distance={80}
              duration={0.4}
            >
              <div
                className={`${classes.borderGlow} flex flex-col flex-1 w-full h-full rounded-[24px]`}
              >
                <div
                  className={`${classes.cardContainer} flex flex-col flex-1 relative w-full h-full rounded-[24px] overflow-hidden`}
                >
                  <div
                    ref={(el) => {
                      cardHostRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 pointer-events-none"
                  />
                  <div
                    className={`flex flex-col flex-1 justify-center items-center w-full h-full text-[var(--color-text)] z-10 ${classes.cardContent}`}
                  >
                    <div className="w-[75px] h-[75px] aspect-square mx-auto flex items-center justify-center mb-5 mt-5 text-[var(--color-primary)]">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[var(--color-text)]">{card.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm font-mono leading-6 font-light">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </BlurIn>
          </div>
        ))}
      </div>

      {/* Mobile/Tablet Carousel (<= 1080px) */}
      <div className="block min-[1081px]:hidden relative w-full h-full max-w-xl mx-auto px-2">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-x">
            {cards.map((card, index) => (
              <div
                className="flex-none p-2 w-[86vw] max-w-[380px] sm:max-w-[420px]"
                key={index}
              >
                <div
                  className={`${classes.card} ${
                    hoveredIdx === index ? classes.hovered : "opacity-60"
                  } mobile-card-${index}
                  flex flex-col w-full h-[320px] sm:h-[350px] overflow-hidden text-center rounded-[24px] transition-opacity duration-300`}
                >
                  <div
                    className={`${classes.borderGlow} flex flex-col flex-1 w-full h-full rounded-[24px]`}
                  >
                    <div
                      className={`${classes.cardContainer} flex flex-col flex-1 relative w-full h-full rounded-[24px] overflow-hidden`}
                    >
                      <div
                        ref={(el) => {
                          mobileCardHostRefs.current[index] = el;
                        }}
                        className="absolute inset-0 pointer-events-none"
                      />
                      <div
                        className={`flex flex-col flex-1 justify-center items-center w-full h-full text-[var(--color-text)] z-10 px-5 py-6 sm:px-8 sm:py-8
                          ${classes.cardContent} ${
                          hoveredIdx === index ? classes.hovered : ""
                        } transition-opacity duration-300`}
                      >
                        <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] aspect-square mx-auto flex items-center justify-center mb-3 text-[var(--color-primary)]">
                          {card.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[var(--color-text)]">
                          {card.title}
                        </h3>
                        <p className="text-[var(--color-text-muted)] text-xs sm:text-sm font-mono leading-relaxed sm:leading-6 font-light">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 px-4 sm:px-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              aria-label="Previous slide"
              className="border border-[var(--color-border)] rounded-full cursor-pointer hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/5 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 text-[var(--color-text)] p-1.5"
            >
              <ChevronLeftIcon
                className="w-5 h-5 sm:w-6 sm:h-6"
                stroke="currentColor"
              />
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              aria-label="Next slide"
              className="border border-[var(--color-border)] rounded-full cursor-pointer hover:bg-white/10 dark:hover:bg-white/10 hover:bg-black/5 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40 text-[var(--color-text)] p-1.5"
            >
              <ChevronRightIcon
                className="w-5 h-5 sm:w-6 sm:h-6"
                stroke="currentColor"
              />
            </button>
          </div>
          <div className="font-mono text-sm opacity-60 text-[var(--color-text)]">
            {selectedSnap + 1} / {snapCount}
          </div>
        </div>
      </div>
      <div className="hidden">
        <div
          ref={lightRaysRef}
          className="absolute inset-0 pointer-events-none rounded-[24px] overflow-hidden"
          style={{ opacity: 0 }}
        >
          <LightRays
            raysOrigin="top-right"
            raysColor="#fff"
            raysSpeed={1.5}
            lightSpread={5}
            rayLength={4}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.05}
            distortion={0.05}
            opacity={0.3}
          />
        </div>
      </div>
    </div>
  );
}
