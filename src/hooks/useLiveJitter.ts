import { useEffect, useState } from "react";

interface UseLiveJitterOptions {
  /** Max wobble amplitude as a fraction of `base` (default 1.2%). */
  wobble?: number;
  /** Max random noise as a fraction of `base` (default 0.4%). */
  noise?: number;
  /** Intro count-up duration in ms (default 900). */
  introMs?: number;
}

/**
 * Mirrors PlatePieletHero's LiveFoodCost: counts up to `base` on mount, then
 * keeps gently wobbling around it forever (like a live dashboard feed).
 * Respects prefers-reduced-motion by holding steady at `base`.
 */
export function useLiveJitter(base: number, options: UseLiveJitterOptions = {}) {
  const { wobble = base * 0.012, noise = base * 0.004, introMs = 900 } = options;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(base);
      return;
    }

    const t0 = performance.now();
    let raf = 0;
    let lastTick = 0;

    const tick = (now: number) => {
      const intro = Math.min(1, (now - t0) / introMs);
      if (intro < 1) {
        setValue(base * (1 - Math.pow(1 - intro, 3)));
      } else if (now - lastTick > 1000) {
        lastTick = now;
        const w = Math.sin(now / 2600) * wobble + Math.sin(now / 1400) * (wobble * 0.5);
        const n = (Math.random() - 0.5) * noise;
        setValue(base + w + n);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [base, wobble, noise, introMs]);

  return value;
}
