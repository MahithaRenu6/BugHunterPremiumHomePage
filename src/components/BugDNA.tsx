import { useState } from "react";
import { motion } from "motion/react";
import { dnaNodes } from "@/lib/bug-data";

const R = 34; // percent radius

export function BugDNA() {
  const [active, setActive] = useState<string>("security");
  const current = dnaNodes.find((n) => n.key === active) ?? dnaNodes[0]!;

  const pos = (angle: number) => ({
    left: `${50 + R * Math.cos((angle * Math.PI) / 180)}%`,
    top: `${50 + R * Math.sin((angle * Math.PI) / 180)}%`,
  });

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[440px]">
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[14%] rounded-full border border-dashed border-border"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-magenta shadow-[0_0_24px_6px_oklch(0.66_0.26_340/0.45)]"
        />

        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" aria-hidden>
          {dnaNodes.map((a, i) =>
            dnaNodes.slice(i + 1).map((b) => (
              <line
                key={a.key + b.key}
                x1={50 + R * Math.cos((a.angle * Math.PI) / 180)}
                y1={50 + R * Math.sin((a.angle * Math.PI) / 180)}
                x2={50 + R * Math.cos((b.angle * Math.PI) / 180)}
                y2={50 + R * Math.sin((b.angle * Math.PI) / 180)}
                stroke="currentColor"
                strokeWidth={a.key === active || b.key === active ? 0.5 : 0.22}
                className={
                  a.key === active || b.key === active
                    ? "text-magenta"
                    : "text-border"
                }
              />
            )),
          )}
        </svg>

        {dnaNodes.map((n) => {
          const on = n.key === active;
          return (
            <button
              key={n.key}
              onMouseEnter={() => setActive(n.key)}
              onFocus={() => setActive(n.key)}
              onClick={() => setActive(n.key)}
              style={pos(n.angle)}
              aria-pressed={on}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center focus:outline-none"
            >
              <span
                className={`mx-auto block size-3.5 rounded-full transition-all ${
                  on
                    ? "bg-magenta shadow-[0_0_18px_5px_oklch(0.66_0.26_340/0.5)] scale-125"
                    : "bg-violet/70"
                }`}
              />
              <span
                className={`label-mono mt-2 block whitespace-nowrap ${on ? "text-foreground" : ""}`}
              >
                {n.label}
              </span>
              <span className="block font-mono text-[0.62rem] text-magenta">{n.score}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={current.key}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="panel rounded-md p-6"
      >
        <span className="label-mono">Bug DNA · strand</span>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase">{current.label}</h3>
        <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${current.score}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-violet to-magenta"
          />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
      </motion.div>
    </div>
  );
}
