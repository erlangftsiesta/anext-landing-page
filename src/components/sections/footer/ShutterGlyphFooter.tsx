"use client";

import * as React from "react";

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

/** Cap height of every glyph, in SVG units. The wordmark's viewBox is this tall. */
export const CAP = 100;
const S = 19; // stem
const B = 17; // bar

const f = (n: number): string => String(Math.round(n * 100) / 100);

/** Axis-aligned box. */
export const rect = (x: number, y: number, w: number, h: number): string =>
  "M" + f(x) + " " + f(y) + "H" + f(x + w) + "V" + f(y + h) + "H" + f(x) + "Z";

/** A slanted stroke `t` wide measured horizontally, from (x1, y1) at the top to (x2, y2) at the bottom. */
export const slant = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  t: number
): string =>
  "M" +
  f(x1) +
  " " +
  f(y1) +
  "H" +
  f(x1 + t) +
  "L" +
  f(x2 + t) +
  " " +
  f(y2) +
  "H" +
  f(x2) +
  "Z";

/** Closed polygon from [x, y, x, y, …]. */
export const poly = (pts: number[]): string => {
  let d = "";
  for (let i = 0; i + 1 < pts.length; i += 2)
    d += (i ? "L" : "M") + f(pts[i]) + " " + f(pts[i + 1]);
  return d + "Z";
};

const at = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  deg: number
): string => {
  const a = (deg * Math.PI) / 180;
  return f(cx + rx * Math.cos(a)) + " " + f(cy + ry * Math.sin(a));
};

/**
 * A band between an outer ellipse (rx, ry) and an inner one (rx - tx, ry - ty),
 * from angle a0 to a1 in degrees. Angles grow clockwise on screen (0 = right,
 * 90 = bottom); a1 < a0 runs the other way.
 */
export const band = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tx: number,
  ty: number,
  a0: number,
  a1: number
): string => {
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const cw = a1 > a0 ? 1 : 0;
  const irx = rx - tx;
  const iry = ry - ty;
  return (
    "M" +
    at(cx, cy, rx, ry, a0) +
    "A" +
    f(rx) +
    " " +
    f(ry) +
    " 0 " +
    large +
    " " +
    cw +
    " " +
    at(cx, cy, rx, ry, a1) +
    "L" +
    at(cx, cy, irx, iry, a1) +
    "A" +
    f(irx) +
    " " +
    f(iry) +
    " 0 " +
    large +
    " " +
    (1 - cw) +
    " " +
    at(cx, cy, irx, iry, a0) +
    "Z"
  );
};

/** A full elliptical ring (needs fill-rule evenodd). */
export const ring = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tx: number,
  ty: number
): string => {
  const e = (r1: number, r2: number) =>
    "M" +
    f(cx - r1) +
    " " +
    f(cy) +
    "A" +
    f(r1) +
    " " +
    f(r2) +
    " 0 1 1 " +
    f(cx + r1) +
    " " +
    f(cy) +
    "A" +
    f(r1) +
    " " +
    f(r2) +
    " 0 1 1 " +
    f(cx - r1) +
    " " +
    f(cy) +
    "Z";
  return e(rx, ry) + e(rx - tx, ry - ty);
};

/** A D-shaped bowl: flat on the left, half an ellipse on the right (needs evenodd). */
export const bowl = (
  x: number,
  y: number,
  w: number,
  h: number,
  t: number,
  tb: number
): string => {
  const ry = h / 2;
  const rx = Math.min(w - t, ry * 0.95);
  const sx = x + w - rx;
  return (
    "M" +
    f(x) +
    " " +
    f(y) +
    "H" +
    f(sx) +
    "A" +
    f(rx) +
    " " +
    f(ry) +
    " 0 0 1 " +
    f(sx) +
    " " +
    f(y + h) +
    "H" +
    f(x) +
    "Z" +
    "M" +
    f(x + t) +
    " " +
    f(y + tb) +
    "H" +
    f(sx) +
    "A" +
    f(rx - t) +
    " " +
    f(ry - tb) +
    " 0 0 1 " +
    f(sx) +
    " " +
    f(y + h - tb) +
    "H" +
    f(x + t) +
    "Z"
  );
};

export type Glyph = { w: number; d: string[] };

const SPACE: Glyph = { w: 42, d: [] };

/** The display alphabet, A–Z. Each glyph is CAP tall; its shapes overlap into one letter. */
export const GLYPHS: Record<string, Glyph> = {
  A: {
    w: 96,
    d: [
      slant(37, 0, 0, 100, 23),
      slant(37, 0, 73, 100, 23),
      rect(18, 60, 60, 16),
    ],
  },
  B: {
    w: 84,
    d: [
      rect(0, 0, S, 100),
      bowl(0, 0, 78, 52, S, B),
      bowl(0, 52 - B, 84, 100 - 52 + B, S, B),
    ],
  },
  C: { w: 90, d: [band(45, 50, 45, 50, S + 2, B, -40, -320)] },
  D: { w: 90, d: [rect(0, 0, S + 1, 100), bowl(0, 0, 90, 100, S + 2, B)] },
  E: {
    w: 72,
    d: [
      rect(0, 0, S, 100),
      rect(0, 0, 72, B),
      rect(0, 41.5, 64, B),
      rect(0, 100 - B, 72, B),
    ],
  },
  F: {
    w: 70,
    d: [rect(0, 0, S, 100), rect(0, 0, 70, B), rect(0, 43, 62, B)],
  },
  G: {
    w: 94,
    d: [band(47, 50, 47, 50, S + 2, B, -38, -360), rect(48, 46, 46, B)],
  },
  H: {
    w: 86,
    d: [rect(0, 0, S, 100), rect(86 - S, 0, S, 100), rect(0, 42, 86, B)],
  },
  I: { w: S + 2, d: [rect(0, 0, S + 2, 100)] },
  J: {
    w: 72,
    d: [rect(72 - S, 0, S, 64), band(36, 62, 36, 38, S, B, 0, 180)],
  },
  K: {
    w: 86,
    d: [
      rect(0, 0, S, 100),
      slant(62, 0, 10, 62, 24),
      slant(30, 42, 62, 100, 24),
    ],
  },
  L: { w: 68, d: [rect(0, 0, S, 100), rect(0, 100 - B, 68, B)] },
  M: {
    w: 112,
    d: [
      rect(0, 0, S + 3, 100),
      slant(0, 0, 46, 100, 9),
      slant(68, 0, 40, 100, 22),
      rect(112 - S - 3, 0, S + 3, 100),
    ],
  },
  N: {
    w: 88,
    d: [rect(0, 0, S, 100), rect(88 - S, 0, S, 100), slant(0, 0, 63, 100, 25)],
  },
  O: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B)] },
  P: { w: 80, d: [rect(0, 0, S, 100), bowl(0, 0, 80, 60, S, B)] },
  Q: {
    w: 100,
    d: [ring(50, 50, 50, 50, S + 2, B), slant(50, 62, 78, 100, 22)],
  },
  R: {
    w: 84,
    d: [
      rect(0, 0, S, 100),
      bowl(0, 0, 82, 58, S, B),
      slant(34, 50, 62, 100, 22),
    ],
  },
  S: {
    w: 80,
    d: [
      band(40, 29.25, 40, 29.25, S, B, -22, -273),
      band(40, 70.75, 40, 29.25, S, B, -93, 158),
    ],
  },
  T: {
    w: 82,
    d: [rect(0, 0, 82, B), rect(41 - S / 2 - 1, 0, S + 2, 100)],
  },
  U: {
    w: 86,
    d: [
      rect(0, 0, S, 60),
      rect(86 - S, 0, S, 60),
      band(43, 58, 43, 42, S, B, 0, 180),
    ],
  },
  V: {
    w: 94,
    d: [slant(0, 0, 36, 100, 22), slant(72, 0, 36, 100, 22)],
  },
  W: {
    w: 132,
    d: [
      slant(0, 0, 26, 100, 20),
      slant(56, 0, 26, 100, 20),
      slant(56, 0, 86, 100, 20),
      slant(112, 0, 86, 100, 20),
    ],
  },
  X: {
    w: 92,
    d: [slant(0, 0, 68, 100, 24), slant(68, 0, 0, 100, 24)],
  },
  Y: {
    w: 92,
    d: [
      slant(0, 0, 35, 56, 22),
      slant(70, 0, 35, 56, 22),
      rect(35, 50, 22, 50),
    ],
  },
  Z: {
    w: 80,
    d: [
      rect(0, 0, 80, B),
      rect(0, 100 - B, 80, B),
      slant(56, B - 1, 0, 100 - B + 1, 24),
    ],
  },
};

/** Any character outside A–Z is a gap. */
export const glyphOf = (ch: string): Glyph => GLYPHS[ch.toUpperCase()] ?? SPACE;

/** The shutter is a square, one cap tall. */
export const SHUTTER = 100;
/** Blade width along the edges it touches. */
const K = 21;
/** Where the pivot rests, in the shutter's own (unrotated) frame. */
export const REST = 77;

/** Rotate (x, y) by `turns` quarter turns clockwise about the shutter's centre. */
export const turn = (x: number, y: number, turns: number): [number, number] => {
  const n = ((turns % 4) + 4) % 4;
  let a = x;
  let b = y;
  for (let i = 0; i < n; i++) {
    const t = a;
    a = SHUTTER - b;
    b = t;
  }
  return [a, b];
};

/** Where the pivot rests for a given rotation. */
export const restPivot = (turns: number): [number, number] =>
  turn(REST, REST, turns);

/**
 * The shutter's three blades for a pivot at (px, py), rotated `turns` quarter
 * turns. Built in the unrotated frame — one thin wedge from the top-left
 * corner, two wide ones along the top and left edges — then turned.
 */
export const blades = (px: number, py: number, turns: number): number[][] => {
  const [qx, qy] = turn(clamp(px, 8, 92), clamp(py, 8, 92), -turns);
  const shapes = [
    [0, 0, K, 0, qx, qy, 0, K],
    [qx, 0, SHUTTER, 0, SHUTTER, K, qx, qy],
    [0, qy, qx, qy, K, SHUTTER, 0, SHUTTER],
  ];
  return shapes.map((s) => {
    const out: number[] = [];
    for (let i = 0; i < s.length; i += 2)
      out.push(...turn(s[i], s[i + 1], turns));
    return out;
  });
};

export type Placed = { ch: string; x: number; w: number; shutter: boolean };

/** Lay the word out left to right with a fixed gap. `shutterAt` swaps that letter for the shutter. */
export const layout = (
  word: string,
  shutterAt: number,
  gap: number = 12
): { items: Placed[]; width: number } => {
  const items: Placed[] = [];
  let x = 0;
  Array.from(word).forEach((ch, i) => {
    const shutter = i === shutterAt && ch.trim() !== "";
    const w = shutter ? SHUTTER : glyphOf(ch).w;
    items.push({ ch, x, w, shutter });
    x += w + gap;
  });
  return { items, width: Math.max(1, x - (items.length ? gap : 0)) };
};

/** Frame-rate independent ease toward a target: `k` is the fraction closed per 1/60s. */
export const approach = (
  from: number,
  to: number,
  k: number,
  dt: number
): number =>
  to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);

const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>";

/**
 * One frame of the link scramble. Letters left of `progress` (0 → 1) are
 * settled; the rest show a noise glyph picked from `seed`. Spaces and
 * punctuation never scramble, so the line keeps its shape.
 */
export const scramble = (
  text: string,
  progress: number,
  seed: number
): string => {
  const chars = Array.from(text);
  const settled = Math.floor(
    clamp(Number.isFinite(progress) ? progress : 1, 0, 1) * chars.length
  );
  return chars
    .map((ch, i) => {
      if (i < settled || !/[a-z0-9]/i.test(ch)) return ch;
      const r =
        Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
      return NOISE[Math.floor(r * NOISE.length)];
    })
    .join("");
};

/** Loose email check: something@something.tld, no spaces. */
export const isEmail = (v: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || "").trim());

/** "#f9531f" / "#f53" → [249, 83, 31]. Anything unparseable is null. */
export const parseHex = (hex: string): [number, number, number] | null => {
  const m = /^#?([\da-f]{3}|([\da-f]{6}))$/i.exec((hex || "").trim());
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Mix two hex colours, `t` of the way from a to b. Unparseable input returns `a` as given. */
export const mixHex = (a: string, b: string, t: number): string => {
  const x = parseHex(a);
  const y = parseHex(b);
  if (!x || !y) return a;
  const k = clamp(Number.isFinite(t) ? t : 0, 0, 1);
  return (
    "#" +
    x
      .map((v, i) =>
        Math.round(v + (y[i] - v) * k)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
};

// #endregion

export type FooterLink = { label: string; href?: string };

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type ShutterGlyphFooterProps = {
  id?: string;
  brand?: string;
  wordmark?: string;
  shutterAt?: number;
  company?: string;
  since?: number;
  year?: number;
  columns?: FooterColumn[];
  onLinkClick?: (label: string, href?: string) => void;
  background?: string;
  ink?: string;
  fontSans?: string;
  fontMono?: string;
  animate?: boolean;
  className?: string;
};

export const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: "Products",
    links: [
      { label: "Services", href: "/#services" },
      { label: "Technology", href: "/#technologies" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/#what-is-anext" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "/teams" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Support", href: "mailto:contact@anext.dev" },
      { label: "Contact", href: "mailto:contact@anext.dev" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

const MONO =
  '"Geist Mono", "JetBrains Mono", "IBM Plex Mono", "Space Mono", ui-monospace, monospace';
const SANS =
  'var(--font-sans, "Manrope", -apple-system, BlinkMacSystemFont, sans-serif)';

const CSS = `
.sgf {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  container-type: inline-size;
  color: var(--sgf-ink, var(--color-text));
  background: linear-gradient(180deg, var(--sgf-top, var(--color-bg)) 0%, var(--sgf-bg, var(--color-bg)) 24%);
  font-family: var(--sgf-sans, var(--font-sans, 'Manrope', sans-serif));
  -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
}
.sgf::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle 800px at 50% -120px, rgba(30, 64, 175, 0.12), transparent);
}
.sgf ::selection {
  background: var(--sgf-ink, var(--color-text));
  color: var(--sgf-bg, var(--color-bg));
}
:where(.sgf) a {
  color: inherit;
  text-decoration: none;
}
:where(.sgf) ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
:where(.sgf) p {
  margin: 0;
}
.sgf svg {
  max-width: none;
}
.sgf .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.sgf-top {
  box-sizing: border-box;
  max-width: 1360px;
  margin: 0 auto;
  padding: clamp(52px, 8cqw, 100px) clamp(24px, 5cqw, 72px) clamp(24px, 3cqw, 40px);
}
.sgf-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(24px, 4cqw, 64px);
  row-gap: 36px;
  margin-bottom: clamp(40px, 5cqw, 64px);
}
@media (min-width: 768px) {
  .sgf-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
@container (min-width: 680px) {
  .sgf-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.sgf-fade {
  transition: opacity .8s ease var(--sgf-d, 0ms), translate .8s cubic-bezier(.2, .7, .1, 1) var(--sgf-d, 0ms);
}
.sgf[data-in='false'] .sgf-fade {
  opacity: 0;
  translate: 0 10px;
}
.sgf-col-title {
  font-family: var(--sgf-sans, var(--font-sans, 'Manrope', sans-serif));
  font-size: clamp(16px, 1.2cqw, 18px);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--sgf-ink, var(--color-text));
  margin: 0 0 18px 0;
  text-transform: none;
}
.sgf-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sgf-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: var(--sgf-sans, var(--font-sans, 'Manrope', sans-serif));
  font-size: clamp(14px, 1cqw, 15.5px);
  font-weight: 400;
  text-transform: none;
  white-space: nowrap;
  padding: 1px 0;
  color: var(--color-text-muted, #7A8193);
  transition: color .2s ease, transform .2s ease;
}
.sgf-link:hover, .sgf-link:focus-visible {
  color: var(--sgf-ink, var(--color-text));
  transform: translateX(2px);
}
.sgf-bottom-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.08));
}
@media (min-width: 640px) {
  .sgf-bottom-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
.sgf-copy {
  font-family: var(--sgf-mono, var(--font-mono, 'Geist Mono', monospace));
  font-size: 12px;
  color: var(--color-text-muted, inherit);
  opacity: .75;
  letter-spacing: .02em;
  line-height: 1.5;
}
.sgf-mark {
  box-sizing: border-box;
  padding: clamp(48px, 6cqw, 84px) clamp(20px, 3.5cqw, 64px) clamp(20px, 3cqw, 36px);
}
.sgf-svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
  fill: var(--sgf-ink, currentColor);
}
.sgf-rise {
  transition: transform 1.15s cubic-bezier(.16, .84, .2, 1) var(--sgf-d, 0ms);
}
.sgf[data-in='false'] .sgf-rise {
  transform: translateY(112px);
}
.sgf-g {
  cursor: pointer;
}
.sgf-flip {
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
.sgf-flip.is-flip {
  animation: sgf-flip .7s cubic-bezier(.2, .8, .2, 1);
}
@keyframes sgf-flip {
  0% { transform: scaleY(1); }
  45% { transform: scaleY(-1); }
  100% { transform: scaleY(1); }
}
.sgf-half {
  transition: transform .45s cubic-bezier(.2, .9, .25, 1.15);
}
.sgf-g:hover .sgf-up {
  transform: translate(5px, -1.5px);
}
.sgf-g:hover .sgf-dn {
  transform: translate(-5px, 1.5px);
}
.sgf-sh polygon {
  transition: none;
}
@media (prefers-reduced-motion: reduce) {
  .sgf .sgf-rise, .sgf .sgf-fade, .sgf .sgf-half, .sgf .sgf-link {
    transition: none !important;
  }
  .sgf .sgf-flip {
    animation: none !important;
  }
  .sgf[data-in='false'] .sgf-rise {
    transform: none;
  }
  .sgf[data-in='false'] .sgf-fade {
    opacity: 1;
    translate: none;
  }
}
`;

const external = (href?: string) =>
  href && /^https?:/.test(href) ? { target: "_blank", rel: "noreferrer" } : {};

function ScrambleLink({
  link,
  still,
  onFollow,
  style,
}: {
  link: FooterLink;
  still: boolean;
  onFollow: (e: React.MouseEvent<HTMLAnchorElement>, l: FooterLink) => void;
  style?: React.CSSProperties;
}) {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const raf = React.useRef(0);
  const text = link.label;

  const run = () => {
    const el = textRef.current;
    if (still || !el) return;
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const seed = Math.random() * 100;
    let n = 0;
    const step = (now: number) => {
      const p = (now - t0) / 380;
      if (p >= 1) {
        el.textContent = text;
        return;
      }
      if (n++ % 2 === 0)
        el.textContent = scramble(text, p, seed + Math.floor(n / 2));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  React.useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <li className="sgf-fade" style={style}>
      <a
        className="sgf-link"
        href={link.href || "#"}
        aria-label={text}
        onPointerEnter={run}
        onFocus={run}
        onClick={(e) => onFollow(e, link)}
        {...external(link.href)}
      >
        <span ref={textRef} aria-hidden="true">
          {text}
        </span>
      </a>
    </li>
  );
}

export default function ShutterGlyphFooter({
  id = "contact",
  brand = "ANEXT",
  wordmark = "ANEXT",
  shutterAt = 3,
  company = "ANEXT - Connecting the infinite",
  since = 2026,
  year = new Date().getFullYear(),
  columns = DEFAULT_COLUMNS,
  onLinkClick,
  background = "var(--color-bg)",
  ink = "var(--color-text)",
  fontSans = SANS,
  fontMono = MONO,
  animate = true,
  className = "",
}: ShutterGlyphFooterProps) {
  const word = ((wordmark ?? brand).trim() || brand).toUpperCase();
  const { items, width } = React.useMemo(
    () => layout(word, shutterAt),
    [word, shutterAt]
  );
  const shutter = items.find((it) => it.shutter);

  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const upId = "sgf-up-" + uid;
  const dnId = "sgf-dn-" + uid;

  const rootRef = React.useRef<HTMLElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const bladeRefs = React.useRef<(SVGPolygonElement | null)[]>([]);
  const ptr = React.useRef({ x: 0, y: 0, inside: false });
  const [turns, setTurns] = React.useState(0);
  const pivot = React.useRef<[number, number]>(restPivot(0));

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);
  const still = reduced || !animate;

  const [seen, setSeen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.1 }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!shutter) return;
    const paint = (x: number, y: number) => {
      blades(x, y, turns).forEach((pts, i) => {
        bladeRefs.current[i]?.setAttribute("points", pts.map(f).join(" "));
      });
    };
    const rest = restPivot(turns);
    if (still || !visible) {
      pivot.current = rest;
      paint(rest[0], rest[1]);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const p = ptr.current;
      const tx = p.inside ? clamp(p.x, 8, 92) : rest[0];
      const ty = p.inside ? clamp(p.y, 8, 92) : rest[1];
      const [x, y] = pivot.current;
      pivot.current = [approach(x, tx, 0.12, dt), approach(y, ty, 0.12, dt)];
      paint(pivot.current[0], pivot.current[1]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shutter, still, visible, turns]);

  const onPointer = (e: React.PointerEvent<HTMLElement>) => {
    const svg = svgRef.current;
    const p = ptr.current;
    p.inside = e.type !== "pointerleave";
    if (!svg || !shutter) return;
    const r = svg.getBoundingClientRect();
    const scale = r.width / width || 1;
    p.x = (e.clientX - r.left) / scale - shutter.x;
    p.y = (e.clientY - r.top) / scale;
  };

  const flip = (e: React.MouseEvent<SVGGElement>) => {
    if (still) return;
    const el = e.currentTarget;
    el.classList.remove("is-flip");
    void el.getBoundingClientRect();
    el.classList.add("is-flip");
  };

  const follow = (e: React.MouseEvent<HTMLAnchorElement>, l: FooterLink) => {
    if (!l.href || l.href === "#") e.preventDefault();
    onLinkClick?.(l.label, l.href);
  };

  const isHexBg = typeof background === "string" && background.startsWith("#");
  const topBg = isHexBg
    ? mixHex(background, "#ffffff", 0.08)
    : "var(--color-surface, var(--color-bg))";

  const vars = {
    "--sgf-bg": background,
    "--sgf-top": topBg,
    "--sgf-ink": ink,
    "--sgf-sans": fontSans,
    "--sgf-mono": fontMono,
  } as React.CSSProperties;

  let d = 0;
  const delay = () => ({ "--sgf-d": (d += 50) + "ms" }) as React.CSSProperties;
  const label = company ?? "The " + brand + " Creative Co.";
  const years = since && since < year ? since + "—" + year : String(year);

  return (
    <footer
      id={id}
      ref={rootRef}
      className={"sgf " + className}
      style={vars}
      data-in={seen || still ? "true" : "false"}
      onPointerMove={onPointer}
      onPointerEnter={onPointer}
      onPointerLeave={onPointer}
    >
      <style>{CSS}</style>

      <div className="sgf-top">
        <div className="sgf-grid">
          {columns.map((col) => (
            <div key={col.title} className="sgf-col sgf-fade" style={delay()}>
              <h3 className="sgf-col-title">{col.title}</h3>
              <ul className="sgf-list">
                {col.links.map((link, linkIdx) => (
                  <ScrambleLink
                    key={link.label + linkIdx}
                    link={link}
                    still={still}
                    onFollow={follow}
                    style={delay()}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="sgf-bottom-bar sgf-fade" style={delay()}>
          <p className="sgf-copy">
            {"© " + years + " " + label}
          </p>
        </div>
      </div>

      <div className="sgf-mark">
        <p className="sr-only">{word}</p>
        <svg
          ref={svgRef}
          className="sgf-svg"
          viewBox={"0 0 " + f(width) + " " + CAP}
          style={{ aspectRatio: width + " / " + CAP }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Every letter is drawn twice, cut at its waist; hover slides the halves apart. */}
            <clipPath id={upId} clipPathUnits="userSpaceOnUse">
              <rect x={-40} y={-200} width={400} height={252.6} />
            </clipPath>
            <clipPath id={dnId} clipPathUnits="userSpaceOnUse">
              <rect x={-40} y={51.4} width={400} height={250} />
            </clipPath>
          </defs>
          {items.map((it, i) => {
            if (it.ch.trim() === "") return null;
            const rise = {
              "--sgf-d": 200 + i * 90 + "ms",
            } as React.CSSProperties;
            if (it.shutter) {
              const rest = restPivot(turns);
              return (
                <g key={i} transform={"translate(" + f(it.x) + " 0)"}>
                  <g className="sgf-rise" style={rise}>
                    <g
                      className="sgf-g sgf-sh"
                      onClick={() => setTurns((t) => t + 1)}
                    >
                      <rect width={SHUTTER} height={CAP} fill="transparent" />
                      {blades(rest[0], rest[1], turns).map((pts, b) => (
                        <polygon
                          key={b}
                          ref={(el) => {
                            bladeRefs.current[b] = el;
                          }}
                          points={pts.map(f).join(" ")}
                        />
                      ))}
                    </g>
                  </g>
                </g>
              );
            }
            const g = glyphOf(it.ch);
            const paths = g.d.map((p, k) => (
              <path key={k} d={p} fillRule="evenodd" />
            ));
            return (
              <g key={i} transform={"translate(" + f(it.x) + " 0)"}>
                <g className="sgf-rise" style={rise}>
                  <g
                    className="sgf-g sgf-flip"
                    onClick={flip}
                    onAnimationEnd={(e) =>
                      e.currentTarget.classList.remove("is-flip")
                    }
                  >
                    <rect width={g.w} height={CAP} fill="transparent" />
                    <g clipPath={"url(#" + upId + ")"}>
                      <g className="sgf-half sgf-up">{paths}</g>
                    </g>
                    <g clipPath={"url(#" + dnId + ")"}>
                      <g className="sgf-half sgf-dn">{paths}</g>
                    </g>
                  </g>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </footer>
  );
}
