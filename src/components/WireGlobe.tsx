import { useEffect, useRef } from "react";

type Props = { className?: string };

/** Rotating wireframe globe rendered on canvas (lat/long lines + point sparkle). */
export function WireGlobe({ className }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // build wireframe vertices: parallels + meridians
    const LAT = 14;
    const LON = 24;
    const lines: { x: number; y: number; z: number }[][] = [];

    for (let i = 1; i < LAT; i++) {
      const phi = (i / LAT) * Math.PI;
      const ring: { x: number; y: number; z: number }[] = [];
      for (let j = 0; j <= 64; j++) {
        const t = (j / 64) * Math.PI * 2;
        ring.push({
          x: Math.sin(phi) * Math.cos(t),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(t),
        });
      }
      lines.push(ring);
    }
    for (let j = 0; j < LON; j++) {
      const t = (j / LON) * Math.PI * 2;
      const arc: { x: number; y: number; z: number }[] = [];
      for (let i = 0; i <= 48; i++) {
        const phi = (i / 48) * Math.PI;
        arc.push({
          x: Math.sin(phi) * Math.cos(t),
          y: Math.cos(phi),
          z: Math.sin(phi) * Math.sin(t),
        });
      }
      lines.push(arc);
    }

    let rot = 0;
    let last = 0;
    const tiltX = -0.32;

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (time - last < 33) return;
      last = time;
      if (!reduced) rot += 0.0045;

      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.42;
      ctx.clearRect(0, 0, w, h);

      // atmosphere
      const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      glow.addColorStop(0, "rgba(168,85,247,0.20)");
      glow.addColorStop(0.55, "rgba(217,70,239,0.08)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const cosT = Math.cos(tiltX);
      const sinT = Math.sin(tiltX);

      for (const line of lines) {
        let prev: { sx: number; sy: number; z: number } | null = null;
        for (const p of line) {
          const x1 = p.x * cosR - p.z * sinR;
          const z1 = p.x * sinR + p.z * cosR;
          const y2 = p.y * cosT - z1 * sinT;
          const z2 = p.y * sinT + z1 * cosT;
          const sx = cx + x1 * R;
          const sy = cy + y2 * R;
          if (prev) {
            const depth = (z2 + prev.z) / 2;
            const front = depth > 0;
            const a = front ? 0.28 + depth * 0.5 : 0.06 + (depth + 1) * 0.08;
            ctx.strokeStyle = front
              ? `rgba(216,140,255,${a.toFixed(3)})`
              : `rgba(140,90,200,${a.toFixed(3)})`;
            ctx.lineWidth = front ? 1.1 : 0.7;
            ctx.beginPath();
            ctx.moveTo(prev.sx, prev.sy);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
          prev = { sx, sy, z: z2 };
        }
      }

      // rim light
      ctx.strokeStyle = "rgba(240,180,255,0.55)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
