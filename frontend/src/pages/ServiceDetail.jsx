import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { getService, img } from "../lib/api";
import { ServiceIcon } from "../lib/icons";
import { Reveal, StaggerGroup, StaggerItem } from "../components/motion";
import SectionHeading from "../components/SectionHeading";
import InquiryForm from "../components/InquiryForm";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import SEO from "../components/SEO";

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setService(null);
    setNotFound(false);
    getService(slug).then(setService).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-serif text-3xl text-ink">Service not found</h1>
        <Link to="/services" className="text-gold hover:underline">Back to all services</Link>
      </div>
    );
  }

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center text-ink-muted">Loading…</div>;
  }

  const galleryKeys = [service.image, "intro", "gallery1", "gallery3"];

  return (
    <div data-testid="service-detail-page">
      <SEO title={service.title} description={service.short_description} image={img(service.image)} />

      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={img(service.image)} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/25" />
        </div>
        <div className="container-px relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl text-ivory">
            <button onClick={() => navigate("/services")} data-testid="back-to-services" className="flex items-center gap-2 text-sm text-ivory/70 hover:text-gold mb-6 transition-colors">
              <ArrowLeft size={16} /> All Services
            </button>
            <div className="w-14 h-14 rounded-full glass flex items-center justify-center text-gold mb-5">
              <ServiceIcon name={service.icon} className="w-6 h-6" />
            </div>
            <span className="label-eyebrow text-gold">{service.tagline}</span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight font-medium">{service.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ivory/80">{service.hero_description}</p>
            <Link to="/book" data-testid="service-hero-book" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-white hover:bg-gold-dark hover:scale-[1.03] transition-all">
              Book this Service <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-py bg-ivory">
        <div className="container-px max-w-3xl">
          <SectionHeading eyebrow="The Experience" title={`A gentle approach to ${service.title.toLowerCase()}`} />
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{service.story}</p>
        </div>
      </section>

      {/* Benefits + Who for */}
      <section className="section-py bg-warmivory">
        <div className="container-px grid md:grid-cols-2 gap-12 lg:gap-16">
          <Reveal>
            <span className="label-eyebrow">Benefits</span>
            <h2 className="mt-3 font-serif text-3xl text-ink mb-8">Why mothers love it</h2>
            <ul className="space-y-4">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-beige">
                  <span className="mt-0.5 w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center text-gold shrink-0">
                    <Check size={15} strokeWidth={2.5} />
                  </span>
                  <span className="text-ink-soft">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="label-eyebrow">Who It's For</span>
            <h2 className="mt-3 font-serif text-3xl text-ink mb-8">Created with you in mind</h2>
            <div className="rounded-2xl overflow-hidden mb-6 h-56">
              <img src={img(galleryKeys[1])} alt="" className="w-full h-full object-cover" />
            </div>
            <ul className="space-y-3">
              {service.who_for.map((w) => (
                <li key={w} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                  <span className="text-ink-soft">{w}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section-py bg-ink text-ivory">
        <div className="container-px">
          <SectionHeading eyebrow="How It Works" title="Your journey with us" light align="center" className="!items-center mb-16" />
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {service.process.map((p, i) => (
              <StaggerItem key={p.title}>
                <div className="relative">
                  <span className="font-serif text-5xl text-gold/30">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-serif text-xl text-ivory">{p.title}</h3>
                  <p className="mt-2 text-sm text-ivory/60 leading-relaxed">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-py bg-ivory">
        <div className="container-px">
          <SectionHeading eyebrow="Gallery" title="A glimpse of the experience" align="center" className="!items-center mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryKeys.map((k, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="aspect-square rounded-2xl overflow-hidden group">
                  <img src={img(k)} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py bg-warmivory">
        <div className="container-px max-w-3xl">
          <SectionHeading eyebrow="Questions" title="Frequently asked" align="center" className="!items-center mb-10" />
          <Accordion type="single" collapsible className="w-full">
            {service.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-beige">
                <AccordionTrigger className="text-left font-serif text-lg text-ink hover:text-gold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-ink-soft leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-peach/30">
        <div className="container-px">
          <SectionHeading eyebrow="Stories" title="Loved by mothers like you" align="center" className="!items-center mb-14" />
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Inquiry */}
      <section className="section-py bg-ivory">
        <div className="container-px grid md:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeading eyebrow="Get in Touch" title={`Interested in ${service.title}?`} subtitle="Share your details and our caring team will reach out to guide you personally." />
          </div>
          <div className="bg-warmivory rounded-2xl p-8 border border-beige">
            <InquiryForm defaultService={service.title} compact />
          </div>
        </div>
      </section>
    </div>
  );
}
