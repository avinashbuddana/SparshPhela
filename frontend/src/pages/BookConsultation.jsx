import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarIcon, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { getServices, postBooking, formatApiErrorDetail } from "../lib/api";
import { Reveal } from "../components/motion";
import PageHero from "../components/PageHero";
import SEO from "../components/SEO";

const TIMES = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"];
const PERKS = ["Personalised, judgement-free guidance", "Care rooted in Indian tradition", "Certified, compassionate experts", "Flexible online & in-person sessions"];

export default function BookConsultation() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [date, setDate] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", preferred_time: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    getServices().then(setServices).catch(() => {});
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const inputCls = "w-full rounded-xl bg-white border border-beige px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.service) return toast.error("Please select a service.");
    setLoading(true);
    try {
      const payload = { ...form, preferred_date: date ? format(date, "yyyy-MM-dd") : "" };
      const res = await postBooking(payload);
      toast.success(res.message);
      setDone(true);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="book-page">
      <SEO
        title="Book a Maternity Wellness Consultation — Sparsh Pehla, Vadodara"
        description="Book a personalised maternity or parenting wellness consultation at Sparsh Pehla, Vadodara. Choose from Garbh Sanskar, prenatal yoga, lactation support, postpartum care and more."
        canonical={`${window.location.origin}/book`}
      />
      <PageHero
        eyebrow={t("book.eyebrow")}
        title={t("book.hero_title")}
        subtitle="Schedule a personalised consultation and let us understand how we can best support you."
        image="wellness_program"
        crumbs={[{ label: "Book Consultation" }]}
      />

      <section className="section-py bg-ivory">
        <div className="container-px grid lg:grid-cols-5 gap-12">
          {/* Info side */}
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="font-serif text-3xl text-ink">What to expect</h2>
              <p className="mt-4 text-ink-soft leading-relaxed">Your consultation is a warm, unhurried conversation. We listen, understand your needs, and gently guide you towards the care that's right for you.</p>
              <ul className="mt-8 space-y-4">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center text-gold shrink-0">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <span className="text-ink-soft text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Form side */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              {done ? (
                <div className="bg-warmivory rounded-3xl p-12 border border-beige text-center" data-testid="booking-success">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 flex items-center justify-center text-gold mb-5">
                    <Check size={30} strokeWidth={2} />
                  </div>
                  <h3 className="font-serif text-2xl text-ink">{t("book.success_title")}, {form.name.split(" ")[0] || "dear"}!</h3>
                  <p className="mt-3 text-ink-soft">Your consultation request has been received. Our team will reach out shortly to confirm your appointment.</p>
                </div>
              ) : (
                <form onSubmit={submit} data-testid="booking-form" className="bg-warmivory rounded-3xl p-8 md:p-10 border border-beige shadow-sm space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <input name="name" required value={form.name} onChange={change} placeholder="Full name" data-testid="booking-name" className={inputCls} />
                    <input name="email" type="email" required value={form.email} onChange={change} placeholder="Email address" data-testid="booking-email" className={inputCls} />
                  </div>
                  <input name="phone" required value={form.phone} onChange={change} placeholder="Phone number" data-testid="booking-phone" className={inputCls} />

                  <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                    <SelectTrigger data-testid="booking-service" className="rounded-xl bg-white border-beige py-6 text-sm focus:ring-gold/20">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {services.map((s) => (
                        <SelectItem key={s.slug} value={s.title}>{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" data-testid="booking-date" className={`${inputCls} flex items-center gap-2 text-left ${date ? "text-ink" : "text-ink-muted"}`}>
                          <CalendarIcon size={16} className="text-gold" />
                          {date ? format(date, "PPP") : "Preferred date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                      </PopoverContent>
                    </Popover>

                    <Select value={form.preferred_time} onValueChange={(v) => setForm({ ...form, preferred_time: v })}>
                      <SelectTrigger data-testid="booking-time" className="rounded-xl bg-white border-beige py-6 text-sm focus:ring-gold/20">
                        <SelectValue placeholder="Preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIMES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <textarea name="message" value={form.message} onChange={change} placeholder="Anything you'd like us to know? (optional)" rows={3} data-testid="booking-message" className={inputCls} />

                  <button type="submit" disabled={loading} data-testid="booking-submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-gold-dark hover:scale-[1.01] disabled:opacity-60">
                    {loading ? "Submitting…" : <>{t("book.submit")} <ArrowRight size={18} /></>}
                  </button>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
