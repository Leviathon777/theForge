import { useState, useEffect, useRef } from "react";

export const useCountUp = (target, duration = 1500) => {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || target === null || target === undefined) return;

    const startTime = performance.now();
    const numTarget = typeof target === "string" ? parseFloat(target.replace(/,/g, "")) : target;
    if (isNaN(numTarget)) {
      setValue(target);
      return;
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * numTarget));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(numTarget);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target, duration]);

  return { ref, displayValue: typeof target === "string" && isNaN(parseFloat(target)) ? target : value };
};
