import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** 0 = calm nebula, 1 = hot core with ember ring */
  intensity?: number;
  hue?: "magenta" | "violet";
};

/**
 * Canvas particle sphere. Pure 2D projection of points on a rotating sphere —
 * no WebGL dependency, hydration-safe (renders only after mount).
 */
export function ParticleOrb({ className = "", intensity = 1, hue = "magenta" }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = 1;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = w < 700 ? 320 : 700;
    const pts = Array.from({ length: COUNT }, () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const jitter = 0.82 + Math.random() * 0.34;
      return {
        x: Math.sin(phi) * Math.cos(theta) * jitter,
        y: Math.sin(phi) * Math.sin(theta) * jitter,
        z: Math.cos(phi) * jitter,
        s: 0.4 + Math.random() * 1.3,
      };
    });

    const base = hue === "magenta" ? 322 : 288;
    let t = 0;
    let last = 0;
    const FRAME = 1000 / 30;

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || now - last < FRAME) return;
      last = now;
      t += reduced ? 0 : 0.0075;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.36;

      // core glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
      g.addColorStop(0, `hsla(${base}, 95%, ${45 + intensity * 12}%, ${0.35 * intensity})`);
      g.addColorStop(0.45, `hsla(${base - 20}, 90%, 40%, ${0.12 * intensity})`);
      g.addColorStop(1, "hsla(280, 80%, 20%, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const cosA = Math.cos(t);
      const sinA = Math.sin(t);
      const cosB = Math.cos(t * 0.6);
      const sinB = Math.sin(t * 0.6);

      for (const p of pts) {
        // rotate Y then X
        let x = p.x * cosA - p.z * sinA;
        let z = p.x * sinA + p.z * cosA;
        const y = p.y * cosB - z * sinB;
        z = p.y * sinB + z * cosB;

        const persp = 1 / (2.2 - z);
        const px = cx + x * R * persp * 2.2;
        const py = cy + y * R * persp * 2.2;
        const depth = (z + 1.2) / 2.4;
        const size = p.s * persp * 1.8;
        const alpha = 0.12 + depth * 0.75;
        const light = 40 + depth * 35;
        ctx.fillStyle = `hsla(${base - depth * 30}, 100%, ${light}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
        x = 0;
      }

      // ember ring
      ctx.strokeStyle = `hsla(${base - 300}, 95%, 55%, ${0.22 * intensity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 1.05, R * 1.05 * Math.abs(Math.cos(t * 0.9)), t, 0, Math.PI * 2);
      ctx.stroke();

    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [intensity, hue]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
