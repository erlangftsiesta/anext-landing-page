import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type MenuItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

type MobileMenuProps = {
  open: boolean;
  close: () => void;
  items: MenuItem[];
};

export function MobileMenu({ open, close, items }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  linksRef.current = [];

  const addLinkRef = (el: HTMLAnchorElement | null) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (linksRef.current.length > 0) {
        linksRef.current.forEach((link, idx) => {
          link.animate(
            [
              { transform: "translateY(24px)", opacity: 0 },
              { transform: "translateY(0)", opacity: 1 },
            ],
            {
              duration: 400,
              delay: idx * 50,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              fill: "forwards",
            }
          );
        });
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 w-full h-[100dvh] bg-[#09090b] text-white z-[999] flex flex-col justify-between p-6 sm:p-10 lg:hidden overflow-y-auto"
      style={{
        transform: open ? "translateY(0)" : "translateY(-100%)",
        opacity: open ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-in-out",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div className="flex items-center justify-between w-full pb-6 border-b border-white/10 shrink-0">
        <a href="/" onClick={close} className="flex items-center gap-2.5">
          <img
            src="/images/anext-logo-only.webp"
            alt="ANEXT Logo"
            width="32"
            height="32"
            loading="lazy"
            decoding="async"
            className="h-8 w-auto object-contain"
          />
          <span className="font-bold tracking-tight text-lg text-white">ANEXT</span>
        </a>
        <button
          onClick={close}
          aria-label="Close menu"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="my-auto py-8 flex flex-col items-start select-none w-full">
        {items.map((item, index) => (
          <div key={index} className="w-full py-1.5 sm:py-2.5">
            <a
              href={item.href}
              onClick={close}
              className="inline-flex items-baseline group text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white hover:text-sky-300 transition-colors"
              ref={addLinkRef}
            >
              <span>{item.label}</span>
              <span className="ml-2.5 text-xs sm:text-sm font-mono font-normal opacity-40 group-hover:opacity-75 transition-opacity">
                {index + 1}
              </span>
            </a>

            {item.children && item.children.length > 0 && (
              <div className="pl-6 sm:pl-8 mt-3 mb-2 flex flex-col gap-2">
                {item.children.map((child, childIndex) => (
                  <a
                    key={childIndex}
                    href={child.href}
                    onClick={close}
                    className="inline-flex items-baseline group text-base sm:text-xl font-bold uppercase tracking-normal text-white/70 hover:text-white transition-colors"
                    ref={addLinkRef}
                  >
                    <span>{child.label}</span>
                    <span className="ml-2 text-xs font-mono font-normal opacity-40 group-hover:opacity-75 transition-opacity">
                      {index + 1}.{childIndex + 1}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
        <a
          href="/teams"
          onClick={close}
          className="w-full sm:w-auto text-center px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-colors"
        >
          Talk to our Engineers
        </a>
        <div className="text-xs font-mono text-white/40">
          © {new Date().getFullYear()} ANEXT. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
