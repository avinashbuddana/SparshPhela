import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Phone, MessageCircle } from "lucide-react";
import { Reveal } from "./motion";

const WA_HREF = `https://wa.me/918980024245?text=${encodeURIComponent("Hello Sparsh Pehla! I'd love to know more about your maternity wellness services.")}`;

/**
 * Reusable contact CTA strip — Book / Call / WhatsApp
 * Props: title, subtitle, bg ("ivory" | "warm" | "dark")
 */
export default function ContactCTA({
  title = "Ready to take the first step?",
  subtitle = "Our caring team is here for you — book a consultation, call us, or simply ping us on WhatsApp.",
  bg = "warm",
}) {
  const bgCls = bg === "dark"
    ? "bg-ink text-ivory"
    : bg === "ivory"
    ? "bg-ivory"
    : "bg-warmivory";

  const titleCls = bg === "dark" ? "text-ivory" : "text-ink";
  const subtitleCls = bg === "dark" ? "text-ivory/70" : "text-ink-soft";

  return (
    <section className={`section-py ${bgCls}`}>
      <div className="container-px">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="label-eyebrow">{bg === "dark" ? "Get in Touch" : "Contact Us"}</span>
          <h2 className={`mt-4 font-serif text-3xl md:text-4xl font-medium leading-tight ${titleCls}`}>{title}</h2>
          <p className={`mt-4 leading-relaxed ${subtitleCls}`}>{subtitle}</p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            {/* Book */}
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full bg-gold text-white px-7 py-3.5 text-sm font-medium hover:bg-gold/90 hover:scale-[1.03] transition-all duration-300 shadow-sm"
            >
              <CalendarCheck size={17} strokeWidth={1.8} />
              Book a Consultation
            </Link>

            {/* Call */}
            <a
              href="tel:+918980024245"
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 border ${
                bg === "dark"
                  ? "border-ivory/30 text-ivory hover:bg-ivory hover:text-ink"
                  : "border-ink/20 text-ink hover:border-gold hover:text-gold"
              }`}
            >
              <Phone size={17} strokeWidth={1.5} />
              Call Us
            </a>

            {/* WhatsApp */}
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-7 py-3.5 text-sm font-medium hover:bg-[#1eb85a] hover:scale-[1.03] transition-all duration-300 shadow-sm"
            >
              <MessageCircle size={17} fill="white" strokeWidth={0} />
              WhatsApp Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
