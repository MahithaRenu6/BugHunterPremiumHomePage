import { useEffect, useRef } from "react";

type Props = { className?: string };

/** Glowing digital globe: network nodes + arcs with purple/magenta bloom. */
export function TechGlobe({ className }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let radius = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width));
      h = Math.max(1, Math.floor(r.height));
      canvas.width = w;
      canvas.height = h;
      radius = Math.min(w, h) * 0.42;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Build a fibonacci sphere of nodes
    const NODE_COUNT = 220;
    const nodes: { x: number; y: number; z: number; pulse: number; speed: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      nodes.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
      });
    }

    // Pre-compute connection pairs within a threshold distance
    const links: [number, number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (!a || !b) continue;
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < 0.42) links.push([i, j, d]);
      }
    }

    // Arc rings (latitude-style glowing bands)
    const rings: number[] = [-0.55, -0.25, 0, 0.25, 0.55];

    let rot = 0;
    let last = 0;
    
    const tiltX = -0.28;

    const project = (p: { x: number; y: number; z: number }) => {
      const x1 = p.x * Math.cos(rot) - p.z * Math.sin(rot);
      const z1 = p.x * Math.sin(rot) + p.z * Math.cos(rot);
      const y2 = p.y * Math.cos(tiltX) - z1 * Math.sin(tiltX);
      const z2 = p.y * Math.sin(tiltX) + z1 * Math.cos(tiltX);
      return { sx: w / 2 + x1 * radius, sy: h / 2 + y2 * radius, z: z2 };
    };

    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      if (time - last < 33) return;
      last = time;
      if (!reduced) rot += 0.0035;

      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Outer soft bloom
      const bloom = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius * 1.6);
      bloom.addColorStop(0, "rgba(168,85,247,0.18)");
      bloom.addColorStop(0.5, "rgba(217,70,239,0.08)");
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      // Project nodes once
      const projected = nodes.map((n, i) => {
        const p = project(n);
        const pulse = Math.sin(time * 0.002 * n.speed + n.pulse) * 0.5 + 0.5;
        return { ...p, pulse, idx: i };
      });

      // Draw links
      for (const [ia, ib, d] of links) {
        const a = projected[ia];
        const b = projected[ib];
        if (!a || !b) continue;
        const depth = (a.z + b.z) / 2;
        if (depth < -0.35) continue; // hide far back
        const front = depth > 0;
        const baseAlpha = front ? 0.22 : 0.06;
        const alpha = baseAlpha + (1 - d / 0.42) * (front ? 0.18 : 0.05);
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.strokeStyle = front
          ? `rgba(216,140,255,${alpha.toFixed(3)})`
          : `rgba(130,80,190,${alpha.toFixed(3)})`;
        ctx.lineWidth = front ? 1.1 : 0.6;
        ctx.stroke();
      }

      // Draw rings
      ctx.lineWidth = 1.2;
      for (const y of rings) {
        const ringRadius = Math.sqrt(1 - y * y) * radius;
        const py = y * Math.cos(tiltX) * radius;
        const pz = y * Math.sin(tiltX);
        const front = pz > -0.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + py, ringRadius, ringRadius * 0.42, 0, 0, Math.PI * 2);
        ctx.strokeStyle = front ? "rgba(216,140,255,0.22)" : "rgba(120,70,170,0.08)";
        ctx.stroke();
      }

      // Draw nodes
      for (const p of projected) {
        if (p.z < -0.45) continue;
        const front = p.z > 0;
        const size = front ? 1.6 + p.pulse * 1.4 : 0.9 + p.pulse * 0.5;
        const alpha = front ? 0.55 + p.pulse * 0.45 : 0.18 + p.pulse * 0.12;

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235,200,255,${alpha.toFixed(3)})`;
        ctx.fill();

        if (front && p.pulse > 0.6) {
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217,70,239,${(0.12 * p.pulse).toFixed(3)})`;
          ctx.fill();
        }
      }

      // Rim light
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(220,160,255,0.35)";
      ctx.lineWidth = 1.3;
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
