import React from "react";

// Line-art mother cradling baby — inspired by the Sparsh Pehla brand mark
function MotherIcon({ className = "", color = "#B3956D" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <g stroke={color} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        {/* mother head */}
        <circle cx="18" cy="12" r="5" />
        {/* mother hair sweep */}
        <path d="M13.5 9.5 C11 13 11 17 13 20" />
        {/* mother torso */}
        <path d="M10.5 40 C9.5 28 12.5 21 18 21 C22 21 25 24 26 29" />
        {/* cradling arm */}
        <path d="M26 29 C29 26 35 27 38 32 C40 35 39 40 35 41" />
        {/* baby head */}
        <circle cx="30.5" cy="32" r="3.6" />
      </g>
    </svg>
  );
}

const SIZES = {
  sm: { icon: "w-8 h-8", main: "text-[24px]", sub: "text-[9px]" },
  md: { icon: "w-9 h-9 md:w-10 md:h-10", main: "text-[28px] md:text-[31px]", sub: "text-[10px]" },
  lg: { icon: "w-11 h-11", main: "text-[34px]", sub: "text-[11px]" },
};

export default function Logo({ light = false, size = "md", className = "" }) {
  const s = SIZES[size] || SIZES.md;
  const iconColor = light ? "#D8C7B0" : "#B3956D";
  const subColor = light ? "rgba(250,248,245,0.8)" : "#803E29";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <MotherIcon className={s.icon} color={iconColor} />
      <span className="flex flex-col leading-none">
        <span style={{ fontFamily: '"Yellowtail", cursive', color: light ? "#E6C99A" : "#B3956D" }} className={`${s.main} leading-[0.85] -mb-0.5`}>
          Sparsh
        </span>
        <span style={{ color: subColor }} className={`${s.sub} tracking-[0.42em] uppercase font-semibold ml-0.5`}>
          Pehla&hellip;
        </span>
      </span>
    </span>
  );
}
