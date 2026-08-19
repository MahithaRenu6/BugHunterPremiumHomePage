import { useState } from "react";
import { motion } from "motion/react";
import { riskAreas } from "@/lib/bug-data";

export function RiskMap() {
  const [active, setActive] = useState<string>("security");
  const current = riskAreas.find((r) => r.key === active) ?? riskAreas[0]!;

  const pts = riskAreas
    .map((r, i) => {
      const a = (i / riskAreas.length) * Math.PI * 2 - Math.PI / 2;
      const rad = 8 + (r.score / 100) * 34;
      return `${50 + rad * Math.cos(a)},${50 + rad * Math.sin(a)}`;
    })
    .join(" ");

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[380px]">
        <svg viewBox="0 0 100 100" className="size-full">
          {[14, 24, 34, 42].map((r) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-border"
            />
          ))}
          {riskAreas.map((_, i) => {
            const a = (i / riskAreas.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 42 * Math.cos(a)}
                y2={50 + 42 * Math.sin(a)}
                stroke="currentColor"
                strokeWidth="0.2"
                className="text-border"
              />
            );
          })}
          <motion.polygon
            points={pts}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "50% 50%" }}
            fill="oklch(0.66 0.26 340 / 0.18)"
            stroke="oklch(0.66 0.26 340)"
            strokeWidth="0.5"
          />
        </svg>

        {riskAreas.map((r, i) => {
          const a = (i / riskAreas.length) * Math.PI * 2 - Math.PI / 2;
          const on = r.key === active;
          return (
            <button
              key={r.key}
              onMouseEnter={() => setActive(r.key)}
              onClick={() => setActive(r.key)}
              style={{
                left: `${50 + 47 * Math.cos(a)}%`,
                top: `${50 + 47 * Math.sin(a)}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            >
              <span className={`label-mono whitespace-nowrap ${on ? "text-magenta" : ""}`}>
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {riskAreas.map((r) => {
          const on = r.key === active;
          return (
            <button
              key={r.key}
              onMouseEnter={() => setActive(r.key)}
              onClick={() => setActive(r.key)}
              className={`panel block w-full rounded-md px-5 py-4 text-left transition-colors ${
                on ? "border-magenta/60" : ""
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-sm font-bold tracking-wide uppercase">
                  {r.label}
                </span>
                <span className="font-mono text-xs text-magenta">{r.score}/100 risk</span>
              </div>
              <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.score}%` }}
                  transition={{ duration: 0.7 }}
                  className={`h-full rounded-full ${
                    r.score > 75
                      ? "bg-destructive"
                      : r.score > 50
                        ? "bg-ember"
                        : "bg-success"
                  }`}
                />
              </div>
              <p className="mt-3 font-mono text-[0.68rem] text-muted-foreground">{r.note}</p>
            </button>
          );
        })}
        <p className="label-mono pt-2">Focused: {current.label}</p>
      </div>
    </div>
  );
}
