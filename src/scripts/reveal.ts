const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initGlobalReveals() {
  if (typeof window === 'undefined') return;
  const isReduced = REDUCED() || window.innerWidth < 768;

  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!els.length) return;

  if (isReduced) {
    els.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = parseFloat(el.dataset.revealDelay || '0');
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
          }, delay * 1000);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => {
    const kind = el.dataset.reveal || 'fade-up';
    const y = kind === 'scale' ? 12 : 24;
    const blur = kind === 'blur' ? 8 : kind === 'fade-up' ? 4 : 0;

    el.style.opacity = '0';
    el.style.transform = `translate3d(0, ${y}px, 0)`;
    el.style.filter = blur ? `blur(${blur}px)` : 'none';
    el.style.transition =
      'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

    observer.observe(el);
  });
}
