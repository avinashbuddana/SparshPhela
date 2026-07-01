import React from "react";

const SIZES = {
  sm: { main: "text-[30px]", sub: "text-[15px]" },
  md: { main: "text-[36px] md:text-[40px]", sub: "text-[18px] md:text-[20px]" },
  lg: { main: "text-[44px]", sub: "text-[22px]" },
};

export default function Logo({ light = false, size = "md", className = "" }) {
  const s = SIZES[size] || SIZES.md;
  const mainFill = light ? "#F8EDD9" : "#FFFFFF";
  const mainStroke = "#1A1210";
  const subColor = light ? "#FF6B5E" : "#D62828";

  return (
    <span className={`relative inline-flex flex-col leading-none ${className}`}>
      <span
        style={{
          fontFamily: '"Yellowtail", cursive',
          color: mainFill,
          WebkitTextStroke: `1.6px ${mainStroke}`,
          paintOrder: "stroke fill",
        }}
        className={`${s.main} leading-[0.8]`}
      >
        Sparsh
      </span>
      <span
        style={{ fontFamily: '"Caveat", cursive', color: subColor }}
        className={`${s.sub} font-bold -mt-1.5 ml-1`}
      >
        Pehla&hellip;
      </span>
    </span>
  );
}
