import React from "react";
import { Heart, Leaf, Star, Users } from "lucide-react";
import { img } from "../lib/api";
import { Reveal, StaggerGroup, StaggerItem } from "../components/motion";
import SectionHeading from "../components/SectionHeading";
import PageHero from "../components/PageHero";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import SEO from "../components/SEO";
import { ORGANIZATION, breadcrumb } from "../lib/seo";
import ContactCTA from "../components/ContactCTA";
import { useTranslation } from "react-i18next";

const VALUES = [
  { icon: Heart, title: "Compassion", desc: "We lead with empathy, meeting every mother where she is — without judgement." },
  { icon: Leaf, title: "Holistic Wellness", desc: "Caring for body, mind, and spirit as one beautifully connected whole." },
  { icon: Star, title: "Tradition & Modernity", desc: "Honouring timeless Indian wisdom while embracing modern wellness science." },
  { icon: Users, title: "Family First", desc: "Because raising a child takes a village, we nurture the whole family." },
];

const STATS = [
  ["14+", "Wellness Services"], ["2000+", "Mothers Supported"], ["10+", "Years of Care"], ["4.9", "Average Rating"],
];

export default function About() {
  const { t } = useTranslation();
  return (
    <div data-testid="about-page">
      <SEO
        title="About Sparsh Pehla — Maternity & Wellness Centre in Vadodara"
        description="Sparsh Pehla is Vadodara's trusted luxury maternity and parenting wellness centre. We blend modern wellness science with timeless Indian traditions to support mothers and families at every step."
        canonical={`${window.location.origin}/about`}
        jsonLd={[ORGANIZATION, breadcrumb([{ name: "Home", url: "/" }, { name: "About Us" }])]}
      />
      <PageHero
        eyebrow={t("about.eyebrow")}
        title={t("about.hero_title")}
        subtitle="Sparsh Pehla means 'the first touch' — the tender beginning of a lifelong bond. We exist to make that journey peaceful, supported, and deeply cared for."
        image="about"
        crumbs={[{ label: "About Us" }]}
      />

      {/* Story */}
      <section className="section-py bg-ivory">
        <div className="container-px grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="rounded-[2rem] overflow-hidden shadow-xl">
              <img src={img("family_counselling")} alt="Our story" className="w-full h-[540px] object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading eyebrow="Who We Are" title="A wellness ecosystem for the modern Indian family" />
            <div className="mt-6 space-y-5 text-ink-soft leading-relaxed">
              <p>Sparsh Pehla was created to fill a tender gap — a space where mothers are not just treated, but truly cared for. We saw how often the emotional, physical, and spiritual needs of mothers were overlooked amid the busyness of life.</p>
              <p>So we built a sanctuary. From Garbh Sanskar and prenatal yoga to lactation guidance and postpartum recovery, every service is delivered with warmth, expertise, and an unwavering belief that mothers deserve the very best.</p>
              <p>Today, we walk beside thousands of families — blending the nurturing wisdom of Indian tradition with thoughtful, modern wellness.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-ink text-ivory">
        <div className="container-px grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(([num, label]) => (
            <Reveal key={label}>
              <p className="font-serif text-4xl md:text-5xl text-gold">{num}</p>
              <p className="mt-2 text-sm text-ivory/60">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="section-py bg-warmivory">
        <div className="container-px grid md:grid-cols-2 gap-8">
          <Reveal className="bg-white rounded-2xl p-10 border border-beige shadow-sm">
            <span className="label-eyebrow">Our Mission</span>
            <h3 className="mt-4 font-serif text-2xl md:text-3xl text-ink leading-snug">To support every mother with care that nurtures her whole self.</h3>
            <p className="mt-4 text-ink-soft leading-relaxed">We are committed to making the motherhood journey gentler, more joyful, and beautifully supported — physically, emotionally, and spiritually.</p>
          </Reveal>
          <Reveal delay={0.1} className="bg-white rounded-2xl p-10 border border-beige shadow-sm">
            <span className="label-eyebrow">Our Vision</span>
            <h3 className="mt-4 font-serif text-2xl md:text-3xl text-ink leading-snug">A world where no mother walks her journey alone.</h3>
            <p className="mt-4 text-ink-soft leading-relaxed">We envision a future where every family has access to compassionate, holistic maternity and parenting care, rooted in tradition and elevated by modern wellness.</p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section-py bg-ivory">
        <div className="container-px">
          <SectionHeading eyebrow="What Guides Us" title="Our values" align="center" className="!items-center mb-14" />
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-peach/50 flex items-center justify-center text-gold mb-5">
                  <Icon strokeWidth={1.3} size={28} />
                </div>
                <h3 className="font-serif text-xl text-ink">{title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{desc}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-peach/30">
        <div className="container-px">
          <SectionHeading eyebrow="Mothers' Stories" title="Words from the families we cherish" align="center" className="!items-center mb-14" />
          <TestimonialsCarousel />
        </div>
      </section>

      <ContactCTA title="Ready to begin your wellness journey?" subtitle="Our caring team is here for you — book a consultation, call us, or simply ping us on WhatsApp." />
    </div>
  );
}
