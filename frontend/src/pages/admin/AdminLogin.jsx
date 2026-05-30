import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { formatApiErrorDetail } from "../../lib/api";
import SEO from "../../components/SEO";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl bg-white border border-beige pl-11 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-warmivory px-6" data-testid="admin-login-page">
      <SEO title="Admin Login" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-semibold text-ink">Sparsh<span className="text-gold"> Pehla</span></span>
          <p className="mt-2 text-ink-muted text-sm tracking-wide">Admin Dashboard</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl p-8 border border-beige shadow-sm space-y-5">
          <h1 className="font-serif text-2xl text-ink">Welcome back</h1>
          {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2" data-testid="login-error">{error}</p>}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} strokeWidth={1.5} />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" data-testid="admin-email" className={inputCls} />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} strokeWidth={1.5} />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" data-testid="admin-password" className={inputCls} />
          </div>
          <button type="submit" disabled={loading} data-testid="admin-login-submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-medium text-white hover:bg-gold-dark transition-all disabled:opacity-60">
            {loading ? "Signing in…" : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
