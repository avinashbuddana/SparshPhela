import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { postNewsletter, formatApiErrorDetail } from "../lib/api";
import Logo from "./Logo";

const SERVICES_LINKS = [
  ["Garbh Sanskar", "/services/garbh-sanskar"],
  ["Pregnancy Yoga", "/services/pregnancy-yoga"],
  ["Family Counselling", "/services/family-counselling"],
  ["Baby Massage & Bath", "/services/baby-massage"],
  ["Lactation Guidance", "/services/lactation-guidance"],
];

const PAGE_LINKS = [
  ["About Us", "/about"],
  ["All Services", "/services"],
  ["Journal", "/blog"],
  ["Gallery", "/gallery"],
  ["Stories", "/testimonials"],
  ["Book Consultation", "/book"],
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await postNewsletter(email);
      toast.success(res.message);
      setEmail("");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="main-footer" className="bg-ink text-ivory">
      <div className="container-px py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
          {/* Brand + newsletter */}
          <div className="md:col-span-4">
            <Logo light size="lg" />
            <p className="mt-4 text-ivory/60 leading-relaxed max-w-sm">
              Supporting every step of motherhood with warmth, wisdom, and care — a luxury maternity & parenting wellness ecosystem.
            </p>
            <form onSubmit={subscribe} className="mt-8 max-w-sm" data-testid="newsletter-form">
              <label className="label-eyebrow text-gold">Join our circle</label>
              <div className="mt-3 flex items-center rounded-full border border-ivory/20 bg-ivory/5 overflow-hidden focus-within:border-gold transition-colors">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  data-testid="newsletter-email-input"
                  className="flex-1 bg-transparent px-5 py-3 text-sm text-ivory placeholder:text-ivory/40 outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="newsletter-submit"
                  className="px-4 text-gold hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Subscribe"
                >
                  <ArrowRight strokeWidth={1.5} />
                </button>
              </div>
            </form>
          </div>

          {/* Services */}
          <div className="md:col-span-3 md:col-start-6">
            <h4 className="label-eyebrow text-gold">Services</h4>
            <ul className="mt-5 space-y-3">
              {SERVICES_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-ivory/70 hover:text-gold transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="label-eyebrow text-gold">Explore</h4>
            <ul className="mt-5 space-y-3">
              {PAGE_LINKS.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-ivory/70 hover:text-gold transition-colors text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="label-eyebrow text-gold">Reach Us</h4>
            <ul className="mt-5 space-y-4 text-sm text-ivory/70">
              <li className="flex gap-3"><MapPin className="text-gold shrink-0" strokeWidth={1.5} size={18} /> Wellness Lane, Pune, Maharashtra, India</li>
              <li className="flex gap-3"><Phone className="text-gold shrink-0" strokeWidth={1.5} size={18} /> +91 89800 24245</li>
              <li className="flex gap-3"><Mail className="text-gold shrink-0" strokeWidth={1.5} size={18} /> sparsh.pehla@gmail.com</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center text-ivory/70 hover:bg-gold hover:text-white hover:border-gold transition-all duration-300"
                  aria-label="social link"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} Sparsh Pehla. Crafted with love for every mother.</p>
          <p>Supporting Every Step of Motherhood</p>
        </div>
      </div>
    </footer>
  );
}
