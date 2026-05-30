import React from "react";
import { Reveal } from "./motion";

export default function SectionHeading({ eyebrow, title, subtitle, align = "left", light = false, className = "" }) {
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <Reveal className={`flex flex-col gap-4 max-w-2xl ${alignCls} ${className}`}>
      {eyebrow && <span className="label-eyebrow">{eyebrow}</span>}
      <h2 className={`font-serif text-3xl sm:text-4xl lg:text-[44px] leading-tight tracking-tight font-medium ${light ? "text-ivory" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg leading-relaxed ${light ? "text-ivory/70" : "text-ink-soft"}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
