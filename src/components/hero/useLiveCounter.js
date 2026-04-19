import { useEffect, useRef, useState } from "react";

/**
 * Animates a number that:
 * - ticks visually toward its current `target` each frame
 * - has its `target` nudged within [min,max] every `driftMs`
 * Returns the current displayed value (number).
 */
export default function useLiveCounter({
  seed,
  min,
  max,
  driftMs = 1600,
  smooth = 0.08,
  integer = true,
}) {
  const [value, setValue] = useState(seed);
  const targetRef = useRef(seed);
  const valueRef = useRef(seed);

  useEffect(() => {
    targetRef.current = seed;
    valueRef.current = seed;
    setValue(seed);
  }, [seed]);

  // Drift the target periodically
  useEffect(() => {
    const iv = setInterval(() => {
      const span = Math.max(1, (max - min) * 0.04);
      const delta = (Math.random() - 0.4) * span; // slightly biased up
      const next = Math.min(max, Math.max(min, targetRef.current + delta));
      targetRef.current = next;
    }, driftMs);
    return () => clearInterval(iv);
  }, [min, max, driftMs]);

  // Smoothly animate toward target every frame
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const t = targetRef.current;
      const v = valueRef.current;
      const next = v + (t - v) * smooth;
      valueRef.current = next;
      setValue(integer ? Math.round(next) : Math.round(next * 100) / 100);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [smooth, integer]);

  return value;
}
