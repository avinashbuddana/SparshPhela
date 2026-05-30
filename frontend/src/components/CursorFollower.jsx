import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorFollower() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  // Spring physics — outer ring lags behind inner dot
  const springX = useSpring(mouseX, { stiffness: 120, damping: 14, mass: 0.08 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 14, mass: 0.08 });

  useEffect(() => {
    // Only show on mouse devices
    if (!window.matchMedia("(hover: hover)").matches) return;

    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const over = (e) => {
      if (e.target.closest("a, button, [role=button], input, textarea, select, label")) {
        setHovering(true);
      }
    };
    const out = (e) => {
      if (e.target.closest("a, button, [role=button], input, textarea, select, label")) {
        setHovering(false);
      }
    };
    const down = () => setClicking(true);
    const up   = () => setClicking(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover",  over);
    document.addEventListener("mouseout",   out);
    document.addEventListener("mousedown",  down);
    document.addEventListener("mouseup",    up);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover",  over);
      document.removeEventListener("mouseout",   out);
      document.removeEventListener("mousedown",  down);
      document.removeEventListener("mouseup",    up);
    };
  }, [mouseX, mouseY, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Outer ring — follows with spring lag */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-gold/60"
          animate={{
            width:   hovering ? 48 : clicking ? 28 : 36,
            height:  hovering ? 48 : clicking ? 28 : 36,
            opacity: hovering ? 0.8 : 0.5,
            borderWidth: hovering ? 1.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        />
      </motion.div>

      {/* Inner dot — follows instantly */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full bg-gold"
          animate={{
            width:   hovering ? 6 : clicking ? 10 : 7,
            height:  hovering ? 6 : clicking ? 10 : 7,
            opacity: hovering ? 1 : 0.85,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </motion.div>
    </>
  );
}
