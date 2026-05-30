import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Heart, ShieldCheck, Sparkles, Clock, Instagram } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { img, getServices, getTestimonials, getBlogs, getFaqs } from "../lib/api";
import { Reveal, StaggerGroup, StaggerItem } from "../components/motion";
import SectionHeading from "../components/SectionHeading";
import ServiceCard from "../components/ServiceCard";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import SEO from "../components/SEO";

const JOURNEY = [
  { phase: "Before", title: "Planning & Garbh Sanskar", desc: "Begin with intention — nurturing body, mind, and the sacred bond from the very start." },
  { phase: "Expecting", title: "Pregnancy Wellness & Yoga", desc: "Gentle movement, nutrition, and emotional care guiding you through every trimester." },
  { phase: "Arrival", title: "Birth & Newborn Guidance", desc: "Calm, confident support as you welcome and understand your little one." },
  { phase: "Beyond", title: "Postpartum & Parenting", desc: "Healing, lactation guidance, and parenting support as your family blossoms." },
];

const WHY = [
  { icon: Heart, title: "Nurturing Care", desc: "Every interaction is warm, gentle, and rooted in genuine compassion for you." },
  { icon: ShieldCheck, title: "Certified Experts", desc: "Government-certified instructors and qualified specialists you can trust." },
  { icon: Sparkles, title: "Holistic Approach", desc: "Modern wellness woven beautifully with timeless Indian traditions." },
  { icon: Clock, title: "Every Step", desc: "From planning to parenting, we walk beside you through it all." },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
    getTestimonials().then(setTestimonials).catch(() => {});
    getBlogs({}).then((b) => setBlogs(b.slice(0, 3))).catch(() => {});
    getFaqs().then(setFaqs).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      <SEO title="Supporting Every Step of Motherhood" />

      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <img src={img("hero")} alt="A serene expecting mother" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-ivory/70 via-transparent to-transparent" />
        </motion.div>

        <div className="container-px relative z-10 pt-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="max-w-2xl">
            <span className="label-eyebrow">Maternity & Parenting Wellness</span>
            <h1 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-[68px] leading-[1.05] tracking-tight font-medium text-ink text-balance">
              Supporting Every Step of <span className="italic text-gold">Motherhood</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft max-w-xl">
              A peaceful, premium wellness ecosystem nurturing mothers and families — from the first heartbeat to the joys of parenting, with warmth and timeless Indian wisdom.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/book" data-testid="hero-book-cta" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gold-dark hover:scale-[1.03] hover:shadow-xl">
                Book a Consultation <ArrowRight size={18} strokeWidth={2} />
              </Link>
              <Link to="/services" data-testid="hero-services-cta" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-8 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:border-gold hover:text-gold">
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-muted">
          <span className="text-[11px] tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* ============ EMOTIONAL INTRO BANNER ============ */}
      <section className="section-py bg-ivory">
        <div className="container-px text-center max-w-4xl mx-auto">
          <Reveal>
            <Sparkles className="mx-auto text-gold mb-6" strokeWidth={1.2} size={32} />
            <p className="font-serif text-2xl sm:text-3xl lg:text-[40px] leading-[1.35] tracking-tight text-ink text-balance">
              Motherhood is not just a moment — it is a <span className="text-gold italic">journey of becoming</span>. We are here to hold your hand through every tender, transformative step.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="section-py bg-warmivory">
        <div className="container-px grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-xl">
              <img src={img("about")} alt="About Sparsh Pehla" className="w-full h-[520px] object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 md:right-8 glass rounded-2xl p-6 shadow-lg max-w-[220px]">
              <p className="font-serif text-4xl text-gold">14+</p>
              <p className="text-sm text-ink-soft mt-1">Wellness services across your motherhood journey</p>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="About Sparsh Pehla"
              title="A sanctuary of care for mothers and families"
              subtitle="Sparsh Pehla — meaning 'the first touch' — was born from a simple belief: that every mother deserves to feel held, supported, and celebrated. We blend modern wellness with the nurturing wisdom of Indian traditions to create a peaceful ecosystem of care."
            />
            <StaggerGroup className="mt-8 grid grid-cols-2 gap-5">
              {["Personalised wellness journeys", "Certified, compassionate experts", "Rooted in Indian tradition", "Care for the whole family"].map((t) => (
                <StaggerItem key={t} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
                  <span className="text-sm text-ink-soft">{t}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
            <Reveal delay={0.2}>
              <Link to="/about" className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-gold hover:gap-3 transition-all">
                Our full story <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="section-py bg-ivory">
        <div className="container-px">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeading eyebrow="What We Offer" title="Wellness for every chapter of motherhood" />
            <Reveal delay={0.1}>
              <Link to="/services" data-testid="home-view-all-services" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-2.5 text-sm font-medium text-ink hover:border-gold hover:text-gold transition-all">
                View all services <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.slice(0, 6).map((s) => (
              <StaggerItem key={s.slug}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="section-py bg-ink text-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={img("cta")} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-px relative">
          <SectionHeading eyebrow="Why Sparsh Pehla" title="Care you can feel, trust you can lean on" light align="center" className="!items-center" />
          <StaggerGroup className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full border border-gold/40 flex items-center justify-center text-gold mb-5">
                  <Icon strokeWidth={1.3} size={28} />
                </div>
                <h3 className="font-serif text-xl text-ivory">{title}</h3>
                <p className="mt-2 text-sm text-ivory/60 leading-relaxed">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ============ JOURNEY TIMELINE ============ */}
      <section className="section-py bg-warmivory">
        <div className="container-px">
          <SectionHeading eyebrow="The Motherhood Journey" title="We walk beside you, every step of the way" align="center" className="!items-center mb-16" />
          <div className="relative">
            <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <StaggerGroup className="grid md:grid-cols-4 gap-10 md:gap-6">
              {JOURNEY.map((step, i) => (
                <StaggerItem key={step.title} className="relative text-center md:text-left">
                  <div className="flex md:block justify-center">
                    <span className="relative z-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold text-white font-serif text-lg shadow-lg">
                      {i + 1}
                    </span>
                  </div>
                  <span className="block mt-5 label-eyebrow">{step.phase}</span>
                  <h3 className="mt-2 font-serif text-xl text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{step.desc}</p>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROGRAM ============ */}
      <section className="section-py bg-ivory">
        <div className="container-px">
          <div className="relative rounded-[2.5rem] overflow-hidden">
            <img src={img("garbh_sanskar")} alt="Garbh Sanskar program" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/20" />
            <div className="relative px-8 py-16 md:p-20 max-w-xl text-ivory">
              <span className="label-eyebrow text-gold">Featured Program</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl leading-tight font-medium">Garbh Sanskar Wellness</h2>
              <p className="mt-5 text-ivory/80 leading-relaxed">
                A holistic blend of meditation, music, and mindful rituals — nurturing the sacred bond between you and your baby from the womb. Fill your pregnancy with calm, positivity, and love.
              </p>
              <Link to="/services/garbh-sanskar" data-testid="featured-program-cta" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-white hover:bg-gold-dark hover:scale-[1.03] transition-all">
                Explore the Program <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section-py bg-peach/30">
        <div className="container-px">
          <SectionHeading eyebrow="Mothers' Stories" title="Loved by families across India" align="center" className="!items-center mb-14" />
          <TestimonialsCarousel data={testimonials.length ? testimonials : null} />
        </div>
      </section>

      {/* ============ INSTAGRAM FEED ============ */}
      <section className="section-py bg-ivory">
        <div className="container-px">
          <SectionHeading eyebrow="@sparshpehla" title="Moments from our community" align="center" className="!items-center mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["gallery1", "gallery3", "intro", "newborn", "yoga", "baby_massage", "gallery4", "photography"].map((k, i) => (
              <Reveal key={k} delay={i * 0.05}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group relative block aspect-square rounded-xl overflow-hidden">
                  <img src={img(k)} alt="Instagram post" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/40 transition-colors duration-300 flex items-center justify-center">
                    <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BLOG PREVIEW ============ */}
      <section className="section-py bg-warmivory">
        <div className="container-px">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <SectionHeading eyebrow="The Journal" title="Wisdom for your motherhood journey" />
            <Reveal delay={0.1}>
              <Link to="/blog" data-testid="home-view-all-blogs" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-2.5 text-sm font-medium text-ink hover:border-gold hover:text-gold transition-all">
                Read the journal <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>
          <StaggerGroup className="grid md:grid-cols-3 gap-8">
            {blogs.map((b) => (
              <StaggerItem key={b.slug}>
                <Link to={`/blog/${b.slug}`} data-testid={`home-blog-${b.slug}`} className="group block">
                  <div className="relative h-60 rounded-2xl overflow-hidden mb-5">
                    <img src={img(b.image)} alt={b.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110" />
                    <span className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs font-medium text-ink">{b.category}</span>
                  </div>
                  <p className="text-xs text-ink-muted">{b.reading_time} min read</p>
                  <h3 className="mt-2 font-serif text-xl text-ink leading-snug group-hover:text-gold transition-colors">{b.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft line-clamp-2">{b.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section-py bg-ivory">
        <div className="container-px grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <SectionHeading eyebrow="Questions" title="Everything you'd like to know" subtitle="Have more questions? We're always here to help — reach out any time." />
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gold hover:gap-3 transition-all">
              Contact us <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="md:col-span-7">
            <Accordion type="single" collapsible className="w-full" data-testid="home-faq">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-beige">
                  <AccordionTrigger className="text-left font-serif text-lg text-ink hover:text-gold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-ink-soft leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ============ CONTACT CTA ============ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-ink">
        <img src={img("intro")} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="container-px relative text-center max-w-3xl mx-auto text-ivory">
          <Reveal>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">Begin your journey with Sparsh Pehla</h2>
            <p className="mt-5 text-ivory/70 text-lg">Let us support you with care, warmth, and wisdom — every step of the way.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/book" data-testid="cta-book" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-white hover:bg-gold-dark hover:scale-[1.03] transition-all">
                Book a Consultation <ArrowRight size={18} />
              </Link>
              <Link to="/contact" data-testid="cta-contact" className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-8 py-3.5 text-sm font-medium text-ivory hover:bg-ivory hover:text-ink transition-all">
                Get in Touch
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
