import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { img, getTestimonials } from "../lib/api";
import StarRating from "./StarRating";

export default function TestimonialsCarousel({ data }) {
  const [items, setItems] = useState(data || []);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!data) getTestimonials().then(setItems).catch(() => {});
  }, [data]);

  const next = useCallback(() => setIndex((i) => (items.length ? (i + 1) % items.length : 0)), [items.length]);
  const prev = () => setIndex((i) => (items.length ? (i - 1 + items.length) % items.length : 0));

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [items.length, next]);

  if (!items.length) return null;
  const t = items[index];

  return (
    <div className="relative max-w-4xl mx-auto" data-testid="testimonials-carousel">
      <Quote className="mx-auto text-gold/30 mb-6" size={56} strokeWidth={1} />
      <div className="relative min-h-[280px] md:min-h-[240px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-4"
          >
            <p className="font-serif text-xl md:text-2xl leading-relaxed text-ink italic">“{t.text}”</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <img src={img(t.image)} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold/30" loading="lazy" />
              <div>
                <p className="font-medium text-ink">{t.name}</p>
                <p className="text-sm text-ink-muted">{t.role}{t.location ? ` · ${t.location}` : ""}</p>
              </div>
              <StarRating rating={t.rating || 5} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button onClick={prev} data-testid="testimonial-prev" className="w-11 h-11 rounded-full border border-beige flex items-center justify-center text-ink-soft hover:bg-gold hover:text-white hover:border-gold transition-all" aria-label="Previous">
          <ChevronLeft strokeWidth={1.5} />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to testimonial ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-gold" : "w-2 bg-beige"}`} />
          ))}
        </div>
        <button onClick={next} data-testid="testimonial-next" className="w-11 h-11 rounded-full border border-beige flex items-center justify-center text-ink-soft hover:bg-gold hover:text-white hover:border-gold transition-all" aria-label="Next">
          <ChevronRight strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
