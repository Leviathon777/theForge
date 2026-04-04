import { useState, useRef, useCallback } from "react";

export const useTilt = (maxTilt = 12) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({
    transform: "perspective(800px) rotateX(0deg) rotateY(0deg)",
    transition: "transform 0.1s ease",
  });

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      const rotateY = percentX * maxTilt;
      const rotateX = -percentY * maxTilt;

      // Set CSS custom properties for glossy reflection positioning
      const mouseXPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseYPercent = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mouse-x", `${mouseXPercent}%`);
      el.style.setProperty("--mouse-y", `${mouseYPercent}%`);

      setStyle({
        transform: `perspective(800px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg)`,
        transition: "transform 0.1s ease",
      });
    },
    [maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.setProperty("--mouse-x", "50%");
      el.style.setProperty("--mouse-y", "50%");
    }
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.4s ease",
    });
  }, []);

  return { ref, style, onMouseMove, onMouseLeave };
};
