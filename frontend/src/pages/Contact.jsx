import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Reveal } from "../components/motion";
import InquiryForm from "../components/InquiryForm";
import SectionHeading from "../components/SectionHeading";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

const INFO = [
  { icon: MapPin, label: "Visit Us", value: "Wellness Lane, Pune, Maharashtra, India" },
  { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
  { icon: Mail, label: "Email Us", value: "care@sparshpehla.com" },
  { icon: Clock, label: "Hours", value: "Mon–Sat · 9:00 AM – 7:00 PM" },
];

export default function Contact() {
  return (
    <div data-testid="contact-page">
      <SEO title="Contact Us" description="Get in touch with Sparsh Pehla for maternity and parenting wellness support." />
      <PageHero
        eyebrow="Contact Us"
        title="We'd love to hear from you"
        subtitle="Whether you have a question or are ready to begin, our caring team is here for you."
        image="emotional_wellness"
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section-py bg-ivory">
        <div className="container-px grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Reach Out" title="Let's connect" subtitle="Send us a message and we'll respond with warmth and care, usually within one working day." />
            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {INFO.map(({ icon: Icon, label, value }) => (
                <Reveal key={label} className="flex gap-4">
                  <span className="w-12 h-12 rounded-full bg-peach/50 flex items-center justify-center text-gold shrink-0">
                    <Icon strokeWidth={1.4} size={22} />
                  </span>
                  <div>
                    <p className="label-eyebrow">{label}</p>
                    <p className="mt-1 text-ink-soft text-sm leading-relaxed">{value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10 rounded-2xl overflow-hidden border border-beige h-72">
              <iframe
                title="Sparsh Pehla location"
                src="https://www.google.com/maps?q=Pune,Maharashtra&output=embed"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="bg-warmivory rounded-3xl p-8 md:p-10 border border-beige shadow-sm">
              <h3 className="font-serif text-2xl text-ink mb-6">Send us a message</h3>
              <InquiryForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
