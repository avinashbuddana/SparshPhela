import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { img } from "../lib/api";
import { ServiceIcon } from "../lib/icons";

export default function ServiceCard({ service }) {
  return (
    <Link
      to={`/services/${service.slug}`}
      data-testid={`service-card-${service.slug}`}
      className="group relative flex flex-col bg-white border border-beige rounded-2xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 hover:border-gold/30"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={img(service.image)}
          alt={service.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent" />
        <div className="absolute top-4 left-4 w-11 h-11 rounded-full glass flex items-center justify-center text-gold">
          <ServiceIcon name={service.icon} className="w-5 h-5" />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-xl font-medium text-ink">{service.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft flex-1">{service.short_description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:gap-3 transition-all duration-300">
          Discover more <ArrowUpRight size={16} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
