"use client";
import React from "react";
import { motion } from "motion/react";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    text: "ANEXT helped us modernize our core architecture with speed and precision. Their engineering-first mindset delivered reliable systems built to scale seamlessly.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Alex Rivers",
    role: "VP of Engineering, NexaPay",
  },
  {
    text: "Their infrastructure expertise and security hardening gave our executive team complete confidence in running high-availability workloads at global scale.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "David Kim",
    role: "Head of Infrastructure, Global Logistics",
  },
  {
    text: "Clear communication, clean code, and zero downtime. ANEXT consistently delivers digital solutions that outperform our highest expectations.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Sarah Chen",
    role: "CTO, FinMatrix Tech",
  },
  {
    text: "Working with ANEXT felt like having a top-tier senior platform engineering team embedded directly inside our company from day one.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Marcus Vance",
    role: "Director of Platform, CyberSecure",
  },
  {
    text: "They built resilient, high-throughput microservices that handled traffic surges without a single hiccup. Truly stellar technical craftsmanship.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Elena Rostova",
    role: "Engineering Director, CloudScale",
  },
  {
    text: "From system design to production deployment, ANEXT tackled every complex requirement with unmatched rigor and speed.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Julian Patel",
    role: "VP of Technology, Vantage Systems",
  },
  {
    text: "The observability pipelines and fault-tolerant architecture ANEXT implemented drastically cut our incident resolution times.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Maya Lin",
    role: "Lead Systems Architect, DataPulse",
  },
  {
    text: "ANEXT does not just deliver code; they establish robust engineering practices that empower our internal team long after launch.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Michael Weber",
    role: "Head of Engineering, Nova Digital",
  },
  {
    text: "The level of architectural discipline and operational readiness ANEXT brings to the table is unmatched in the industry.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=96&h=96&q=75&auto=format&fit=crop",
    name: "Rachel Torres",
    role: "Engineering Manager, Apex Logistics",
  },
];

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  "aria-hidden"?: boolean;
}> = ({ testimonial, "aria-hidden": ariaHidden }) => (
  <div
    aria-hidden={ariaHidden}
    className="mb-6 p-8 sm:p-10 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-sm shadow-lg shadow-black/5 dark:shadow-blue-950/10 max-w-xs w-full text-[var(--color-text)] select-none"
  >
    <div className="text-sm sm:text-base leading-relaxed text-[var(--color-text)] font-light opacity-95">
      &ldquo;{testimonial.text}&rdquo;
    </div>
    <div className="flex items-center gap-3 mt-6">
      <img
        width={40}
        height={40}
        src={testimonial.image}
        alt={testimonial.name}
        loading="lazy"
        className="h-10 w-10 rounded-full object-cover border border-[var(--color-border)] shrink-0"
      />
      <div className="flex flex-col text-left">
        <div className="font-medium tracking-tight leading-5 text-[var(--color-text)] text-sm sm:text-base">
          {testimonial.name}
        </div>
        <div className="leading-5 opacity-60 tracking-tight text-xs text-[var(--color-text-muted)] font-mono">
          {testimonial.role}
        </div>
      </div>
    </div>
  </div>
);

export const TestimonialsColumn: React.FC<{
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
  entranceDelay?: number;
}> = ({ className, testimonials, duration = 35, entranceDelay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: entranceDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`testimonials-marquee-paused ${className || ""}`}
    >
      <div
        style={{
          "--marquee-duration": `${duration}s`,
        } as React.CSSProperties}
        className="testimonial-track flex flex-col will-change-transform"
      >
        {testimonials.map((t, i) => (
          <TestimonialCard key={`orig-${i}`} testimonial={t} />
        ))}
        {testimonials.map((t, i) => (
          <TestimonialCard key={`clone-${i}`} testimonial={t} aria-hidden />
        ))}
      </div>
    </motion.div>
  );
};

export function TestimonialsSection() {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section
      id="testimonials"
      className="w-full relative flex items-center justify-center text-center sm:my-36 my-20 mx-0 overflow-hidden"
    >
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] opacity-80 mb-4 font-light"
        >
          &#123;&nbsp;TESTIMONIALS&nbsp;&#125;
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-medium lg:text-7xl md:text-6xl sm:text-5xl text-3xl text-center leading-[1.08] max-w-4xl mx-auto text-[var(--color-text)] tracking-tight"
        >
          Engineered trust, proven in production
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto font-light"
        >
          See how product teams ship resilient platforms with ANEXT — from architecture audits to 24/7 scaling.
        </motion.p>

        <div className="flex justify-center gap-6 mt-12 sm:mt-16 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] max-h-[720px] overflow-hidden">
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={30}
            entranceDelay={0.1}
            className="w-full max-w-xs flex justify-center"
          />

          <TestimonialsColumn
            testimonials={secondColumn}
            duration={44}
            entranceDelay={0.22}
            className="hidden md:flex w-full max-w-xs justify-center"
          />

          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={36}
            entranceDelay={0.35}
            className="hidden lg:flex w-full max-w-xs justify-center"
          />
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
