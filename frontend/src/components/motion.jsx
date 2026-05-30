import React, { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

// ── Easing curves ─────────────────────────────────────────────────────────────
const ease  = [0.22, 1, 0.36, 1];        // expo-out — silky deceleration
const easeS = [0.16, 1, 0.3, 1];         // quint-out — even softer landings

// ── Infrastructure ────────────────────────────────────────────────────────────
export function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    let rafId;
    function raf(time) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
  return children;
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

// ── Reveal — fade + rise on scroll ───────────────────────────────────────────
export function Reveal({ children, delay = 0, y = 32, x = 0, scale = 1, duration = 0.85, className = "", ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={{ duration, ease: easeS, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── SlideIn — horizontal reveal ───────────────────────────────────────────────
export function SlideIn({ children, direction = "left", delay = 0, duration = 0.85, className = "", ...rest }) {
  const x = direction === "left" ? -56 : direction === "right" ? 56 : 0;
  const y = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, ease: easeS, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── TextReveal — word-by-word stagger for headings ────────────────────────────
export function TextReveal({ children, delay = 0, className = "", stagger = 0.045 }) {
  const words = String(children).split(" ");
  return (
    <motion.span
      className={`inline ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          variants={{
            hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
            show: {
              opacity: 1, y: 0, filter: "blur(0px)",
              transition: { duration: 0.6, ease: easeS, delay: delay + i * stagger },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── CountUp — animated number for stats ──────────────────────────────────────
export function CountUp({ to, suffix = "", decimals = 0, duration = 1.8, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : String(Math.round(v))
  );

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(count, to, { duration, ease: "easeOut" });
    return ctrl.stop;
  }, [inView, to, duration, count]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

// ── Float — gentle levitation for decorative elements ────────────────────────
export function Float({ children, amount = 10, duration = 5, delay = 0, className = "" }) {
  return (
    <motion.div
      animate={{ y: [-amount / 2, amount / 2, -amount / 2] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── ScaleIn — zoom-in reveal ──────────────────────────────────────────────────
export function ScaleIn({ children, delay = 0, className = "", ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: easeS, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── StaggerGroup — staggered container ───────────────────────────────────────
export function StaggerGroup({ children, className = "", stagger = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "", y = 28 }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeS } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── ImageReveal — clip-path curtain wipe ─────────────────────────────────────
export function ImageReveal({ src, alt, className = "", imgClassName = "" }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}

// ── PageTransition — fade between routes ─────────────────────────────────────
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease }}
    >
      {children}
    </motion.div>
  );
}
