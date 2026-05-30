import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { img } from "../lib/api";

export default function PageHero({ eyebrow, title, subtitle, image = "cta", crumbs = [] }) {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={img(image)} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ivory/95 via-ivory/80 to-ivory/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ivory via-transparent to-transparent" />
      </div>
      <div className="container-px relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl">
          {crumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs text-ink-muted mb-5">
              <Link to="/" className="hover:text-gold">Home</Link>
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <ChevronRight size={12} />
                  {c.to ? <Link to={c.to} className="hover:text-gold">{c.label}</Link> : <span className="text-ink-soft">{c.label}</span>}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && <span className="label-eyebrow">{eyebrow}</span>}
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight font-medium text-ink text-balance">{title}</h1>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-ink-soft max-w-xl">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}
