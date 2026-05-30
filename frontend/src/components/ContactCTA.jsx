import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Phone, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./motion";

const WA_HREF = `https://wa.me/918980024245?text=${encodeURIComponent("Hello Sparsh Pehla! I'd love to know more about your maternity wellness services.")}`;

export default function ContactCTA({ title, subtitle, bg = "warm" }) {
  const { t } = useTranslation();

  const heading  = title    ?? t("cta.default_title");
  const body     = subtitle ?? t("cta.default_subtitle");
  const label    = bg === "dark" ? t("cta.get_in_touch") : t("cta.contact_us");

  const bgCls      = bg === "dark" ? "bg-ink text-ivory" : bg === "ivory" ? "bg-ivory" : "bg-warmivory";
  const titleCls   = bg === "dark" ? "text-ivory" : "text-ink";
  const subtitleCls= bg === "dark" ? "text-ivory/70" : "text-ink-soft";

  return (
    <section className={`section-py ${bgCls}`}>
      <div className="container-px">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="label-eyebrow">{label}</span>
          <h2 className={`mt-4 font-serif text-3xl md:text-4xl font-medium leading-tight ${titleCls}`}>{heading}</h2>
          <p className={`mt-4 leading-relaxed ${subtitleCls}`}>{body}</p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-full bg-gold text-white px-7 py-3.5 text-sm font-medium hover:bg-gold/90 hover:scale-[1.03] transition-all duration-300 shadow-sm"
            >
              <CalendarCheck size={17} strokeWidth={1.8} />
              {t("common.book_consultation")}
            </Link>

            <a
              href="tel:+918980024245"
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 border ${
                bg === "dark"
                  ? "border-ivory/30 text-ivory hover:bg-ivory hover:text-ink"
                  : "border-ink/20 text-ink hover:border-gold hover:text-gold"
              }`}
            >
              <Phone size={17} strokeWidth={1.5} />
              {t("common.call_us")}
            </a>

            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-7 py-3.5 text-sm font-medium hover:bg-[#1eb85a] hover:scale-[1.03] transition-all duration-300 shadow-sm"
            >
              <MessageCircle size={17} fill="white" strokeWidth={0} />
              {t("common.whatsapp_us")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
