import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Quote, ArrowRight } from "lucide-react";
import { getTestimonials, img } from "../lib/api";
import { StaggerGroup, StaggerItem, Reveal } from "../components/motion";
import StarRating from "../components/StarRating";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    getTestimonials().then(setItems).catch(() => {});
  }, []);

  return (
    <div data-testid="testimonials-page">
      <SEO title="Stories" description="Real stories from mothers and families who experienced the care of Sparsh Pehla." />
      <PageHero
        eyebrow="Mothers' Stories"
        title="Heartfelt words from our families"
        subtitle="Nothing means more to us than the trust of the mothers we care for. Here are their stories."
        image="mother_care"
        crumbs={[{ label: "Stories" }]}
      />

      <section className="section-py bg-ivory">
        <div className="container-px">
          <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
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

      <section className="section-py bg-warmivory">
        <div className="container-px text-center">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl text-ink">Become part of our story</h2>
            <p className="mt-4 text-ink-soft max-w-xl mx-auto">Let us care for you the way we've cared for so many mothers before.</p>
            <Link to="/book" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-white hover:bg-gold-dark hover:scale-[1.03] transition-all">
              Book a Consultation <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
