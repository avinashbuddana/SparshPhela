import React, { useState } from "react";
import { toast } from "sonner";
import { postInquiry, formatApiErrorDetail } from "../lib/api";

export default function InquiryForm({ defaultService = "", compact = false }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: defaultService, message: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postInquiry(form);
      toast.success(res.message);
      setForm({ name: "", email: "", phone: "", service: defaultService, message: "" });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl bg-white border border-beige px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all";

  return (
    <form onSubmit={submit} data-testid="inquiry-form" className="space-y-4">
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        <input name="name" required value={form.name} onChange={change} placeholder="Your name" data-testid="inquiry-name" className={inputCls} />
        <input name="email" type="email" required value={form.email} onChange={change} placeholder="Email address" data-testid="inquiry-email" className={inputCls} />
      </div>
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        <input name="phone" value={form.phone} onChange={change} placeholder="Phone (optional)" data-testid="inquiry-phone" className={inputCls} />
        <input name="service" value={form.service} onChange={change} placeholder="Service of interest" data-testid="inquiry-service" className={inputCls} />
      </div>
      <textarea name="message" required value={form.message} onChange={change} placeholder="How can we support you?" rows={compact ? 3 : 4} data-testid="inquiry-message" className={inputCls} />
      <button
        type="submit"
        disabled={loading}
        data-testid="inquiry-submit"
        className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-gold-dark hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
