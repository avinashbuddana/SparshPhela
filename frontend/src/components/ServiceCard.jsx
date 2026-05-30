import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { img } from "../lib/api";
import { ServiceIcon } from "../lib/icons";

export default function ServiceCard({ service }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 24px 48px -8px rgba(139,125,107,0.18)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        to={`/services/${service.slug}`}
        data-testid={`service-card-${service.slug}`}
        className="group relative flex flex-col bg-white border border-beige rounded-2xl overflow-hidden shadow-sm h-full"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={img(service.image)}
            alt={service.title}
            loading="lazy"
            className="w-full h-full object-cover"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.08 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent" />

          {/* Icon badge */}
          <motion.div
            className="absolute top-4 left-4 w-11 h-11 rounded-full glass flex items-center justify-center text-gold"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <ServiceIcon name={service.icon} className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-serif text-xl font-medium text-ink group-hover:text-gold transition-colors duration-300">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft flex-1">
            {service.short_description}
          </p>
          <motion.span
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold"
            animate={{ gap: "6px" }}
            whileHover={{ gap: "10px" }}
            transition={{ duration: 0.25 }}
          >
            Discover more <ArrowUpRight size={16} strokeWidth={2} />
          </motion.span>
        </div>

        {/* Bottom gold line on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-gold to-gold/40 rounded-full"
          initial={{ width: "0%" }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </Link>
    </motion.div>
  );
}
