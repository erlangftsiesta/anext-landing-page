import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BlurIn } from "../../animations/blur-in";
import { WordByWord } from "../../animations/word-by-word";
import Aurora from "../../animations/aurora-background";
import NoiseOverlay from "../../animations/noise-overlay";
import { PrimaryButton } from "../../common/primary-button";
import { TransparentButton } from "../../common/transparent-button";
import { MobileMenu } from "./mobile-menu";
import { SectionSubheading } from "../../common/section-subheading";
import { ShineText } from "../../common/shine-text";
import LazyRender from "../../common/lazy-render";
import classes from "./header.module.css";

export type MenuItem = {
  id: string;
  label: string;
  href: string;
  children?: {
    id: string;
    label: string;
    href: string;
    description: string;
    thumbnail?: string;
  }[];
};

export type HeaderProps = {
  heading?: string;
  subheading?: string;
  breadcrumb?: string;
  actions?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  shrink?: boolean;
  menuItems: Array<MenuItem>;
  fadeInColors?: {
    desktop: [string, string, string];
    mobile: [string, string, string];
    css: string;
  };
  menuAction?: React.ReactNode;
  background?: boolean;
  variant?: "full" | "menu";
  floating?: boolean;
};

const HIDE_SUBMENU_DELAY = 2000;
const INITIAL_SUBMENU_STATE = {
  state: "hidden",
  coords: { x: 0, y: 0 },
  items: null,
} as const;

export function Header({
  menuItems,
  shrink = true,
  heading = "We exist to help your ideas grow into something real and reliable.",
  subheading = "We build systems that grow with you. From infrastructure to applications, we support you every step of the way.",
  breadcrumb,
  bottomPanel,
  fadeInColors,
  menuAction,
  background = true,
  variant = "full",
  floating = true,
  actions = (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md sm:max-w-none mx-auto">
      <PrimaryButton
        href="/teams"
        className="w-full sm:w-auto text-center justify-center min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-[20px] text-base font-semibold shadow-lg"
      >
        Talk to our Engineers
      </PrimaryButton>
      <TransparentButton
        href="/projects"
        className="w-full sm:w-auto text-center justify-center min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-[20px] text-base font-semibold"
      >
        Explore Things We Did
      </TransparentButton>
    </div>
  ),
}: HeaderProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const capsuleRef = useRef<HTMLDivElement | null>(null);
  const [hoveringTarget, setHoveringTarget] = useState<MenuItem | null>(null);
  const [submenu, setSubmenu] = useState<{
    state: "hidden" | "visible";
    coords: { x: number; y: number };
    items: MenuItem["children"] | null;
  }>(INITIAL_SUBMENU_STATE);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hideSubmenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const [auroraReady, setAuroraReady] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCapsuleHovered, setIsCapsuleHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLight(document.documentElement.classList.contains("light"));

    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleScroll = () => {
      if (!floating) return;
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (floating) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (floating) {
        window.removeEventListener("scroll", handleScroll);
      }
      observer.disconnect();
    };
  }, [floating]);

  useEffect(() => {
    if (!isCapsuleHovered) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        capsuleRef.current &&
        !capsuleRef.current.contains(e.target as Node)
      ) {
        setIsCapsuleHovered(false);
        setHoveringTarget(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isCapsuleHovered]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  };

  const onMenuItemMouseEnter = useCallback(
    (item: MenuItem, e: React.MouseEvent<HTMLDivElement>) => {
      setHoveringTarget(item);

      if (item.children) {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetY = 0;
        const scrollTop = window.scrollY || window.pageYOffset;

        setSubmenu({
          state: "visible",
          items: item.children,
          coords: {
            x: rect.left,
            y: rect.bottom + offsetY + scrollTop,
          },
        });
      }
    },
    [],
  );

  const scheduleHideSubmenu = useCallback((item: MenuItem) => {
    if (hideSubmenuTimeoutRef.current) {
      clearTimeout(hideSubmenuTimeoutRef.current);
    }
    setSubmenu((prev) => ({ ...prev, state: "hidden" }));

    hideSubmenuTimeoutRef.current = setTimeout(() => {
      setSubmenu(INITIAL_SUBMENU_STATE);
      setHoveringTarget(null);
    }, HIDE_SUBMENU_DELAY);
  }, []);

  const onMenuItemMouseLeave = useCallback(
    (item: MenuItem, e: React.MouseEvent<HTMLDivElement>) => {
      const relatedTarget = e.relatedTarget as HTMLElement;

      if (relatedTarget) {
        if (relatedTarget.classList.contains("menu-item")) {
          scheduleHideSubmenu(item);
          return;
        }
        if (relatedTarget.classList.contains("submenu")) {
          return;
        }
      }

      if (!item.children) {
        setHoveringTarget(null);
      } else {
        scheduleHideSubmenu(item);
      }
    },
    [],
  );

  const submenuBackgroundColor = useMemo(() => {
    if (!fadeInColors) {
      return;
    }
    function darkenColor(hex: string, factor: number) {
      const num = parseInt(hex.replace("#", ""), 16);

      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;

      r = Math.floor(r * (1 - factor));
      g = Math.floor(g * (1 - factor));
      b = Math.floor(b * (1 - factor));

      return `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;
    }

    function lightenColor(hex: string, factor: number) {
      const num = parseInt(hex.replace("#", ""), 16);

      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;

      r = Math.round(r + (255 - r) * factor);
      g = Math.round(g + (255 - g) * factor);
      b = Math.round(b + (255 - b) * factor);

      return `#${[r, g, b]
        .map((x) => x.toString(16).padStart(2, "0"))
        .join("")}`;
    }

    return {
      from: lightenColor(fadeInColors.css, 0.2),
      to: darkenColor(fadeInColors.css, 0.4),
    };
  }, [fadeInColors]);

  if (variant === "menu") {
    return (
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-5 sm:pt-7 z-50 relative">
        <div
          className="relative isolate flex items-center px-5 py-3.5 sm:p-5 rounded-[20px] sm:rounded-[32px] justify-between text-white border border-white/15 shadow-2xl overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] bg-[#0a0f1d]/85 dark:bg-black/60 backdrop-blur-2xl pointer-events-none -z-10"
          />

          <div className="flex justify-start">
            <a href="/" className="flex items-center gap-3 group" aria-label="Home">
              <img
                src="/images/anext-logo-only.webp"
                alt="ANEXT Logo"
                width="40"
                height="40"
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          <nav className="md:flex hidden justify-center font-medium text-sm lg:text-base flex-1">
            {menuItems.map((item) => {
              const isHovered = item === hoveringTarget;
              const isAnyHovered = hoveringTarget !== null;
              const isBlurred = isAnyHovered && !isHovered;

              return (
                <div
                  key={item.id}
                  onMouseEnter={(e) => onMenuItemMouseEnter(item, e)}
                  onMouseLeave={(e) => onMenuItemMouseLeave(item, e)}
                  className={`px-4 menu-item ${item.children ? "menu-item--children" : ""}`}
                >
                  <a
                    href={item.href}
                    className={`transition-all duration-300 font-medium ${
                      isHovered
                        ? "text-white"
                        : isBlurred
                          ? "text-white/30 blur-[1.5px]"
                          : "text-white hover:text-white"
                    }`}
                  >
                    {isHovered ? (
                      <ShineText className="inline text-white">{item.label}</ShineText>
                    ) : (
                      item.label
                    )}
                  </a>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light theme"
              className="p-1.5 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-white" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
            </button>
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        <MobileMenu
          open={mobileMenuOpen}
          close={() => setMobileMenuOpen(false)}
          items={menuItems}
        />
      </header>
    );
  }

  return (
    <header className="p-3 sm:p-6 md:p-8 lg:p-10">
      <div
        ref={headerRef}
        className={`flex justify-center overflow-hidden relative sm:rounded-[36px] rounded-[24px] transition-opacity duration-500
          ${shrink
            ? "pb-14 sm:pb-20 md:pb-24 xl:h-[91vh] min-h-[560px] sm:min-h-[680px] md:min-h-[760px] xl:max-h-[920px]"
            : bottomPanel
              ? "pb-14 sm:pb-20 md:pb-24 min-h-[560px] sm:min-h-[680px] flex-col items-center"
              : "pb-14 sm:pb-20 md:pb-24 xl:h-[85vh] min-h-[560px] sm:min-h-[680px] xl:max-h-[920px]"
          }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#0d1f3c] to-[#050b14]"></div>
        {background && (
          <LazyRender
            className="absolute inset-0 z-0 top-[0px] bottom-[0px] left-[0px] right-[0px] pointer-events-none"
            threshold={0}
            rootMargin="800px 0px 0px 0px"
            skip={!!fadeInColors}
          >
            <>
              <Aurora
                onReady={() => setAuroraReady(true)}
                transitionColorStops={{
                  desktop: ["#050b14", "#1E40AF", "#0a1b33"],
                  mobile: ["#050b14", "#1E40AF", "#0a1b33"],
                }}
                glowColor="#1E40AF"
              />
              <NoiseOverlay />
            </>
          </LazyRender>
        )}
        <div
          className={`container relative z-10 transition-opacity duration-500 px-3 sm:px-6 xl:px-12`}
        >
          <div className="sm:rounded-[32px] rounded-[20px] xl:mt-12 lg:mt-10 md:mt-8 mt-7 sm:mt-8 relative overflow-hidden">
            {/* DEFAULT STATE */}
            <div
              className={`transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled
                  ? "opacity-0 -translate-y-4 scale-[0.98] pointer-events-none"
                  : "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                }`}
            >
              <div
                className="relative isolate flex items-center px-5 py-3.5 sm:p-5 rounded-[20px] sm:rounded-[32px] justify-between text-white border border-white/20 shadow-2xl overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[inherit] bg-black/75 dark:bg-black/50 backdrop-blur-2xl pointer-events-none -z-10"
                />

                <div className="flex justify-start">
                  <a href="/" className="flex items-center gap-3 group">
                    <img
                      src="/images/anext-logo-only.webp"
                      alt="ANEXT Logo"
                      width="40"
                      height="40"
                      className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </a>
                </div>

                <nav
                  className={`md:flex hidden justify-center font-medium text-sm lg:text-base flex-1`}
                >
                  {menuItems.map((item) => {
                    const isHovered = item === hoveringTarget;
                    const isAnyHovered = hoveringTarget !== null;
                    const isBlurred = isAnyHovered && !isHovered;

                    return (
                      <div
                        key={item.id}
                        onMouseEnter={(e) => onMenuItemMouseEnter(item, e)}
                        onMouseLeave={(e) => onMenuItemMouseLeave(item, e)}
                        className={`px-4 menu-item ${
                          item.children ? "menu-item--children" : ""
                        }`}
                      >
                        <a
                          href={item.href}
                          className={`transition-all duration-300 font-medium ${
                            isHovered
                              ? "text-white"
                              : isBlurred
                                ? "text-white/30 blur-[1.5px]"
                                : "text-white hover:text-white"
                          }`}
                        >
                          {isHovered ? (
                            <ShineText className="inline text-white">
                              {item.label}
                            </ShineText>
                          ) : (
                            item.label
                          )}
                        </a>
                        {item.children && (
                          <span
                            className={`pl-2 transition-opacity duration-200 ${
                              isHovered
                                ? "opacity-90 cursor-pointer text-white"
                                : !isAnyHovered
                                  ? "opacity-60 text-white"
                                  : "opacity-40 text-white"
                            }`}
                          >
                            <ChevronDown className="inline-block w-4 h-4" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </nav>

                <div className="md:flex hidden items-center ml-auto mr-4">
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle dark/light theme"
                    className="p-1.5 ml-1 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    {isLight ? (
                      <Moon className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                    )}
                  </button>
                </div>

                <div className="md:hidden flex justify-end items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="p-1.5 rounded-full border border-white/20 text-white transition-colors cursor-pointer mr-1"
                  >
                    {isLight ? (
                      <Moon className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-300" />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={mobileMenuOpen}
                    className={`${classes.mobileMenu} relative w-6 h-5 cursor-pointer bg-transparent border-0 p-0 focus:outline-hidden`}
                    onClick={() => {
                      setMobileMenuOpen((prev) => !prev);
                    }}
                  >
                    <div
                      className={`${classes.mobileMenuLine} absolute top-1/2 left-0 right-0 w-full h-[2px] bg-white rounded transition-transform duration-300`}
                    >
                      <div
                        className={`${classes.mobileMenuLineBefore} absolute top-[-8px] left-0 right-0 w-full h-[2px] bg-white rounded transition-transform duration-300`}
                      ></div>
                      <div
                        className={`${classes.mobileMenuLineAfter} absolute top-[8px] left-0 right-0 w-full h-[2px] bg-white rounded transition-transform duration-300`}
                      ></div>
                    </div>
                  </button>
                  {menuAction && (
                    <div className="mr-[-12px] mt-[-12px] mb-[-12px] ml-[24px]">
                      {menuAction}
                    </div>
                  )}
                </div>

                {menuAction && (
                  <div className="mr-[-12px] mt-[-12px] mb-[-12px] ml-[12px] md:flex hidden">
                    {menuAction}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SCROLLED STATE */}
          {mounted &&
            typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {isScrolled && (
                  <motion.div
                    key="floating-capsule-portal"
                    initial={{ opacity: 0, y: -28, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.92 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 28,
                      mass: 0.8,
                    }}
                    className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
                  >
                    <motion.div
                      ref={capsuleRef}
                      layout
                      transition={{
                        layout: { type: "spring", stiffness: 420, damping: 30 },
                      }}
                      onMouseEnter={() => setIsCapsuleHovered(true)}
                      onMouseLeave={() => {
                        setIsCapsuleHovered(false);
                        setHoveringTarget(null);
                      }}
                      onClick={() => {
                        if (!isCapsuleHovered) setIsCapsuleHovered(true);
                      }}
                      tabIndex={0}
                      role="region"
                      aria-label="Navigation capsule"
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && !isCapsuleHovered) {
                          e.preventDefault();
                          setIsCapsuleHovered(true);
                        }
                      }}
                      className={`pointer-events-auto relative flex items-center justify-between rounded-full backdrop-blur-2xl transition-colors duration-300 ${isLight
                          ? "bg-[#0a0f1d]/95 text-white border border-white/20 shadow-[0_20px_45px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)]"
                          : "bg-white/95 text-slate-900 border border-slate-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.8)]"
                        } ${!isCapsuleHovered && !mobileMenuOpen
                          ? `px-5 py-2.5 cursor-pointer hover:scale-[1.03] select-none ${isLight
                            ? "hover:border-white/40 shadow-[0_20px_45px_rgba(0,0,0,0.5)]"
                            : "hover:border-slate-300 shadow-[0_20px_45px_rgba(0,0,0,0.4)]"
                          }`
                          : "px-5 sm:px-7 py-2.5 gap-6 sm:gap-8 w-auto max-w-[94vw]"
                        }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {!isCapsuleHovered && !mobileMenuOpen ? (
                          /* COMPACT CAPSULE */
                          <motion.div
                            key="compact-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.16 }}
                            className="flex items-center gap-2.5 whitespace-nowrap"
                          >
                            <img
                              src="/images/anext-logo-only.webp"
                              alt="ANEXT Logo"
                              width="24"
                              height="24"
                              className="h-6 w-auto object-contain"
                            />
                            <span
                              className={`font-sans font-bold text-sm tracking-tight ${isLight ? "text-white" : "text-slate-950"
                                }`}
                            >
                              ANEXT
                            </span>
                          </motion.div>
                        ) : (
                          /* EXPANDED CAPSULE */
                          <motion.div
                            key="expanded-content"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.16 }}
                            className="flex items-center gap-4 sm:gap-7 w-full justify-between whitespace-nowrap"
                          >
                            {/* Logo */}
                            <a
                              href="/"
                              className="flex items-center gap-2.5 group shrink-0"
                            >
                              <img
                                src="/images/anext-logo-only.webp"
                                alt="ANEXT Logo"
                                width="24"
                                height="24"
                                className="h-6 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            </a>

                            <nav className="hidden sm:flex items-center gap-5 sm:gap-6 font-medium text-sm">
                              {menuItems.map((item) => {
                                const isHovered = hoveringTarget === item;
                                const isAnyHovered = hoveringTarget !== null;

                                if (isLight) {
                                  return (
                                    <a
                                      key={item.id}
                                      href={item.href}
                                      onMouseEnter={() =>
                                        setHoveringTarget(item)
                                      }
                                      onMouseLeave={() =>
                                        setHoveringTarget(null)
                                      }
                                      className={`transition-all duration-300 ${!isAnyHovered
                                          ? "text-white/80 hover:text-white"
                                          : isHovered
                                            ? "text-white font-medium scale-105"
                                            : "text-white/30 blur-[1.5px] scale-95"
                                        }`}
                                    >
                                      {isHovered ? (
                                        <ShineText className="inline text-white">
                                          {item.label}
                                        </ShineText>
                                      ) : (
                                        item.label
                                      )}
                                    </a>
                                  );
                                } else {
                                  return (
                                    <a
                                      key={item.id}
                                      href={item.href}
                                      onMouseEnter={() =>
                                        setHoveringTarget(item)
                                      }
                                      onMouseLeave={() =>
                                        setHoveringTarget(null)
                                      }
                                      className={`transition-all duration-300 ${!isAnyHovered
                                          ? "text-slate-700 hover:text-slate-950 font-medium"
                                          : isHovered
                                            ? "text-slate-950 font-bold scale-105"
                                            : "text-slate-400/40 blur-[1.5px] scale-95"
                                        }`}
                                    >
                                      {item.label}
                                    </a>
                                  );
                                }
                              })}
                            </nav>

                            {/* Controls */}
                            <div className="flex items-center gap-2 sm:gap-2.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTheme();
                                }}
                                aria-label="Toggle theme"
                                className={`p-1.5 rounded-full border transition-colors cursor-pointer ${isLight
                                    ? "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                                    : "border-slate-200/90 bg-slate-100/90 hover:bg-slate-200 text-slate-800"
                                  }`}
                              >
                                {isLight ? (
                                  <Moon className="w-3.5 h-3.5 text-white fill-white/20" />
                                ) : (
                                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                                )}
                              </button>

                              {/* Mobile Navigation Trigger */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMobileMenuOpen((prev) => !prev);
                                }}
                                aria-label="Open mobile menu"
                                className={`sm:hidden p-1.5 rounded-full border transition-colors cursor-pointer ${isLight
                                    ? "border-white/20 bg-white/10 hover:bg-white/20 text-white"
                                    : "border-slate-200/90 bg-slate-100/90 hover:bg-slate-200 text-slate-800"
                                  }`}
                              >
                                <Menu className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )}
          {variant === "full" && (
            <div
              className={`centered text-center pt-12 sm:pt-16 lg:pt-20 flex flex-col items-center ${bottomPanel ? "pb-0" : "pb-16 sm:pb-24"
                }`}
            >
              {breadcrumb && (
                <BlurIn>
                  <SectionSubheading>{breadcrumb}</SectionSubheading>
                </BlurIn>
              )}
              <h1
                className={`
              ${shrink
                    ? "xl:text-[5.75rem] lg:text-[4.75rem] md:text-6xl sm:text-5xl text-3xl leading-[1.1] sm:leading-[1.05]"
                    : "xl:text-[4.75rem] lg:text-[4rem] md:text-5xl sm:text-4xl text-2xl leading-[1.15]"
                  } font-medium max-w-5xl sm:max-w-6xl self-center px-2 sm:px-0 text-white tracking-tight text-center
            `}
              >
                <WordByWord>{heading}</WordByWord>
              </h1>
              <BlurIn delay={0.35}>
                <p className="mt-4 sm:text-base text-xs sm:text-sm font-light font-mono text-slate-300 max-w-2xl sm:leading-[26px] leading-[22px] lg:p-0 px-2 sm:px-4">
                  {subheading}
                </p>
              </BlurIn>
              {actions && (
                <div className={`${shrink ? "mt-12 sm:mt-16 md:mt-20" : "mt-10 sm:mt-14"} w-full px-2 sm:px-4`}>
                  <BlurIn delay={0.7} distance={10}>
                    {actions}
                  </BlurIn>
                </div>
              )}
            </div>
          )}
        </div>

        {bottomPanel}
      </div>

      <div
        className="submenu absolute top-full z-[100] pt-12 duration-[600ms] transition"
        style={{
          left: submenu.coords.x,
          top: submenu.coords.y,
          ...(submenu.state === "visible"
            ? {
              pointerEvents: "auto",
              opacity: 1,
              filter: "blur(0)",
              transform: "translate(-50%, 0)",
            }
            : {
              pointerEvents: "none",
              opacity: 0,
              filter: "blur(4px)",
              transform: "translate(-50%, 30px)",
            }),
        }}
        onMouseEnter={() => {
          if (hideSubmenuTimeoutRef.current) {
            clearTimeout(hideSubmenuTimeoutRef.current);
          }
        }}
        onMouseLeave={(event) => {
          const relatedTarget = event.relatedTarget as HTMLElement;
          if (relatedTarget) {
            if (relatedTarget.classList.contains("menu-item--children")) {
              return;
            }
          }
          scheduleHideSubmenu(hoveringTarget!);
          setHoveringTarget(null);
        }}
      >
        <div
          className="w-max backdrop-blur-lg rounded-[24px] p-2 shadow-xl shadow-xl/20 border border-white/15 flex"
          style={{
            maxWidth: "1120px",
            background: fadeInColors
              ? `linear-gradient(135deg, ${submenuBackgroundColor?.from} 0%, ${submenuBackgroundColor?.to} 100%)`
              : `linear-gradient(135deg, #0d1e3d 0%, #071124 100%)`,
          }}
        >
          {submenu.items?.map((child) => (
            <a
              key={child.id}
              href={child.href}
              className="group block p-4 rounded-[20px] hover:bg-white/10 transition-colors flex-1"
            >
              {child.thumbnail && (
                <div className="rounded-[16px] overflow-hidden mb-5 shadow-lg">
                  <img
                    src={child.thumbnail}
                    alt={child.label}
                    className="w-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="font-medium text-lg mb-1">{child.label}</div>
              <div className="text-sm opacity-70 font-mono">
                {child.description}
              </div>
            </a>
          ))}
        </div>
      </div>
      <MobileMenu
        open={mobileMenuOpen}
        close={() => setMobileMenuOpen(false)}
        items={menuItems}
      />
    </header>
  );
}
