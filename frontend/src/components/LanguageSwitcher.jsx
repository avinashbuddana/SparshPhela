import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { LANGUAGES } from "../i18n";

export default function LanguageSwitcher({ light = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (code) => { i18n.changeLanguage(code); setOpen(false); };

  const btnCls = light
    ? "text-ivory/80 hover:text-gold"
    : "text-ink-soft hover:text-gold";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${btnCls}`}
        aria-label="Select language"
      >
        <Globe size={16} strokeWidth={1.5} />
        <span className="hidden sm:inline max-w-[80px] truncate">{current.native}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-beige rounded-2xl shadow-xl py-2 min-w-[180px] max-h-80 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => select(lang.code)}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors hover:bg-warmivory
                ${lang.code === i18n.language ? "text-gold font-semibold bg-gold/5" : "text-ink"}`}
            >
              <span>{lang.native}</span>
              <span className="text-xs text-ink-muted ml-2">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
