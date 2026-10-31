import React, { useEffect, useRef, useState } from "react";

interface BlurInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  container?: Element | string | null;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  className?: string;
}

export function BlurIn({
  children,
  distance = 0,
  direction = "vertical",
  reverse = false,
  duration = 0.9,
  threshold = 0.1,
  delay = 0,
  className = "",
  style,
  ...props
}: BlurInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const offset = reverse ? -distance : distance;
  const transformStart =
    direction === "horizontal"
      ? `translate3d(${offset}px, 0, 0)`
      : `translate3d(0, ${offset}px, 0)`;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .blur-in-container {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
      <div
        ref={ref}
        className={`blur-in-container ${className}`}
        style={{
          ...style,
          opacity: isVisible ? 1 : 0,
          filter: isVisible ? "blur(0px)" : "blur(8px)",
          transform: isVisible ? "translate3d(0, 0, 0)" : transformStart,
          transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
          willChange: isVisible ? "auto" : "opacity, transform, filter",
        }}
        {...props}
      >
        {children}
      </div>
    </>
  );
}

export default BlurIn;
