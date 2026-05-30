import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] origin-left h-[3px]"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #B3956D, #D4AF37, #C9A96E)",
      }}
    />
  );
}
