import React from "react";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export default function SectionHeading({ eyebrow, title, subtitle, align = "left", light = false, className = "" }) {
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <motion.div
      className={`flex flex-col gap-4 max-w-2xl ${alignCls} ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {eyebrow && (
        <motion.span
          className="label-eyebrow"
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        className={`font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight tracking-tight font-medium ${light ? "text-ivory" : "text-ink"}`}
        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={`text-base md:text-lg leading-relaxed ${light ? "text-ivory/70" : "text-ink-soft"}`}
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
