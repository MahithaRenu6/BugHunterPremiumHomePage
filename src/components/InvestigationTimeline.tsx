import { useState } from "react";
import { motion } from "motion/react";
import { commits } from "@/lib/bug-data";
import { CodePanel } from "./CodePanel";

export function InvestigationTimeline() {
  const [active, setActive] = useState(2);
  const c = commits[active] ?? commits[0]!;

  return (
    <div className="space-y-8">
      <div className="relative pt-10">
        <div className="absolute top-[3.35rem] right-4 left-4 h-px bg-border" />
        <div className="relative flex justify-between">
          {commits.map((commit, i) => {
            const on = i === active;
            return (
              <button
                key={commit.hash}
                onClick={() => setActive(i)}
                className="group relative flex w-1/4 flex-col items-center focus:outline-none"
              >
                {commit.infected ? (
                  <span className="label-mono mb-2 whitespace-nowrap text-destructive">
                    bug introduced ↓
                  </span>
                ) : (
                  <span className="mb-2 block h-[1.1rem]" />
                )}
                <span
                  className={`size-3.5 rounded-full border transition-all ${
                    commit.infected
                      ? "border-destructive bg-destructive shadow-[0_0_16px_4px_oklch(0.6_0.24_20/0.5)]"
                      : on
                        ? "border-magenta bg-magenta"
                        : "border-border bg-secondary group-hover:border-magenta"
                  } ${on ? "scale-125" : ""}`}
                />
                <span
                  className={`label-mono mt-3 whitespace-nowrap ${on ? "text-foreground" : ""}`}
                >
                  {commit.id}
                </span>
                <span className="mt-1 font-mono text-[0.62rem] text-muted-foreground/70">
                  {commit.hash}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div
        key={c.hash}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]"
      >
        <div className="panel rounded-md p-5">
          <span className="label-mono">{c.hash}</span>
          <h3 className="mt-2 font-display text-lg font-bold">{c.msg}</h3>
          <p className="mt-2 font-mono text-xs text-muted-foreground">by {c.author}</p>
          <p
            className={`mt-4 border-t border-border pt-4 text-sm ${
              c.infected ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {c.infected
              ? "This is where the vulnerability entered the codebase."
              : "No new risk introduced in this change."}
          </p>
        </div>
        <CodePanel
          file="src/api/auth.js"
          status={c.infected ? "Vulnerable" : "Clean"}
          lines={c.lines}
        />
      </motion.div>
    </div>
  );
}
