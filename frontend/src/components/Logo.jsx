import React from "react";
import logoMarkFull from "../assets/logo-mark-full.svg";

const HEIGHTS = {
  sm: "h-11",
  md: "h-14 md:h-16",
  lg: "h-20 md:h-24",
};

export default function Logo({ light = false, size = "md", className = "" }) {
  const h = HEIGHTS[size] || HEIGHTS.md;
  const img = <img src={logoMarkFull} alt="Sparsh Pehla" className={`w-auto ${h}`} />;

  if (!light) {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  }

  return (
    <span className={`inline-flex items-center rounded-2xl bg-ivory px-3 py-2 ${className}`}>
      {img}
    </span>
  );
}
