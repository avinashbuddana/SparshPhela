import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import { getTestimonials, img } from "../lib/api";
import { StaggerGroup, StaggerItem } from "../components/motion";
import StarRating from "../components/StarRating";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";
import ContactCTA from "../components/ContactCTA";

export default function Testimonials() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  useEffect(() => {
    getTestimonials().then(setItems).catch(() => {});
  }, []);

  return (
    <div data-testid="testimonials-page">
      <SEO
        title="Mothers' Stories & Reviews — Sparsh Pehla"
        description="Read heartfelt reviews and real stories from mothers and families who experienced Sparsh Pehla's maternity and parenting wellness services in Vadodara."
        canonical={`${window.location.origin}/testimonials`}
      />
      <PageHero
        eyebrow={t("testimonials.eyebrow")}
        title={t("testimonials.hero_title")}
        subtitle="Nothing means more to us than the trust of the mothers we care for. Here are their stories."
        image="mother_care"
        crumbs={[{ label: "Stories" }]}
      />

      <section className="section-py bg-ivory">
        <div className="container-px">
          <StaggerGroup key={items.length > 0 ? "loaded" : "empty"} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((t, i) => (
              <StaggerItem key={t.id || i}>
                <div className="h-full bg-white rounded-2xl p-8 border border-beige shadow-sm flex flex-col" data-testid={`testimonial-card-${i}`}>
                  <Quote className="text-gold/40" size={32} strokeWidth={1.2} />
                  <p className="mt-4 text-ink-soft leading-relaxed flex-1 italic">“{t.text}”</p>
                  <div className="mt-6 flex items-center gap-4">
                    <img src={img(t.image)} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover border border-gold/30" />
                    <div className="flex-1">
                      <p className="font-medium text-ink text-sm">{t.name}</p>
                      <p className="text-xs text-ink-muted">{t.role}{t.location ? ` · ${t.location}` : ""}</p>
                    </div>
                  </div>
                  <div className="mt-4"><StarRating rating={t.rating || 5} /></div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <ContactCTA title="Become part of our story" subtitle="Let us care for you the way we've cared for so many mothers before — book, call, or WhatsApp us." />
    </div>
  );
}
