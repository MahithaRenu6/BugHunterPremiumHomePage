import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { PageFrame } from "@/components/PageFrame";
import { rootCause } from "@/lib/bug-data";

export const Route = createFileRoute("/understand")({
  head: () => ({
    meta: [
      { title: "Don't just fix it. Understand it. — BugHunter" },
      {
        name: "description",
        content:
          "BugHunter explains what's wrong, why it's dangerous and how to fix it the right way.",
      },
      { property: "og:title", content: "Don't just fix it. Understand it. — BugHunter" },
      {
        property: "og:description",
        content: "Plain-language explanations of every finding, with safe remediation guidance.",
      },
    ],
  }),
  component: Understand,
});

const steps = [
  {
    title: "What's happening",
    body: "The user input `id` is being added directly into the SQL query string.",
  },
  {
    title: "What's wrong",
    body: "This allows attackers to modify the query and access unauthorised data.",
  },
  {
    title: "Why it's dangerous",
    body: "Attackers can dump tables, bypass authentication and delete records.",
  },
  {
    title: "What to do",
    body: "Use parameterised queries or prepared statements — never concatenate input.",
  },
];

function Understand() {
  const [explained, setExplained] = useState(false);

  return (
    <PageFrame index={4} kicker="Explanation">
      <div className="relative grid flex-1 items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h1 className="display-xl">
            Don&apos;t just
            <br />
            fix it.
            <br />
            <span className="glow-magenta text-magenta">Understand it.</span>
          </h1>
          <button className="btn-ghost-line mt-10" onClick={() => setExplained((v) => !v)}>
            {explained ? "Hide explanation" : "Explain this bug →"}
          </button>

          <AnimatePresence>
            {explained ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-8 space-y-4"
              >
                {rootCause.map((r) => (
                  <div key={r.key} className="panel rounded-md p-4">
                    <div className="label-mono text-magenta">{r.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                  </div>
                ))}
                <Link to="/fixed" className="btn-ghost-line inline-flex">
                  See the fix →
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div>
          <span className="label-mono">Why BugHunter flagged this</span>
          <ol className="relative mt-8 space-y-8 border-l border-border pl-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.55 }}
                className="relative"
              >
                <span className="absolute top-1 -left-[2.15rem] size-2.5 rounded-full bg-magenta shadow-[0_0_12px_3px_oklch(0.66_0.26_340/50%)]" />
                <h3 className="font-display text-sm font-bold tracking-wide uppercase">
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </PageFrame>
  );
}
