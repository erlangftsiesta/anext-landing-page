import { useRef } from "react";

export function TransparentButton({
  children,
  href,
  onClick,
  className = "",
  target,
  inline = true,
  size = "medium",
  type = "button",
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  target?: string;
  inline?: boolean;
  size?: "small" | "medium";
  type?: "button" | "submit";
  "aria-label"?: string;
}) {
  const circleRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (circleRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      circleRef.current.style.left = `${e.clientX - rect.left}px`;
      circleRef.current.style.top = `${e.clientY - rect.top}px`;
      circleRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (circleRef.current) {
      circleRef.current.style.opacity = "0";
    }
  };

  const classes = `btn bg-white hover:bg-[#F5F5F0] border border-[#DFE2EB] hover:border-[#102850]/50 rounded-[20px] text-[#102850] font-semibold hover:cursor-pointer shadow-xs hover:shadow-sm
          ${
            size === "medium"
              ? "py-3.5 px-7 sm:py-4 sm:px-8 min-h-[50px] sm:min-h-[54px] sm:text-base text-[0.95rem] "
              : "py-2.5 px-5 sm:py-3 sm:px-6 min-h-[44px] sm:text-[15px] text-[0.90rem]"
          } inset-0 overflow-hidden relative flex items-center justify-center text-center
          hover:scale-[0.98] transition-all duration-200
          active:scale-[0.95]
         ${className}`;

  const content = (
    <>
      <span className="flex items-center">{children}</span>
      <span
        ref={circleRef}
        className="absolute rounded-full pointer-events-none w-5 h-5
            bg-[var(--primary-color)] z-10
            transform -translate-x-1/2 -translate-y-1/2
            filter blur-lg mix-blend-lighten
            opacity-0 transition-opacity duration-300"
      />
    </>
  );

  return (
    <div
      className={`relative ${inline ? "inline-flex" : "flex"} overflow-hidden`}
    >
      {href ? (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          target={target}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      ) : (
        <button
          type={type}
          className={classes}
          onClick={onClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label={ariaLabel}
        >
          {content}
        </button>
      )}
    </div>
  );
}
