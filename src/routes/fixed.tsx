import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageFrame } from "@/components/PageFrame";
import { CodePanel } from "@/components/CodePanel";

export const Route = createFileRoute("/fixed")({
  head: () => ({
    meta: [
      { title: "Hunted. Understood. Fixed. — BugHunter" },
      {
        name: "description",
        content:
          "See the before and after: BugHunter turns a critical finding into a safe, parameterised fix.",
      },
      { property: "og:title", content: "Hunted. Understood. Fixed. — BugHunter" },
      {
        property: "og:description",
        content: "Before and after diff with a verified, resolved vulnerability.",
      },
    ],
  }),
  component: Fixed,
});

function Fixed() {
  const [shown, setShown] = useState(false);

  return (
    <PageFrame index={5} kicker="Resolution">
      <div className="relative grid flex-1 items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h1 className="display-xl">
            Hunted.
            <br />
            Understood.
            <br />
            <span className="glow-magenta text-magenta">Fixed.</span>
          </h1>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Every fix ships with the reasoning behind it, so your team learns as the codebase gets
            safer.
          </p>
          <button className="btn-hunt mt-10" onClick={() => setShown((v) => !v)}>
            {shown ? "Hide the diff" : "See the diff →"}
            <span className="size-1.5 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
          </button>
        </div>

        <div className="space-y-4">
          <CodePanel
            file="Before"
            status="Vulnerable"
            lines={[
              { n: 30, code: "function getUser(id) {" },
              { n: 31, code: '  const query = "SELECT * FROM users WHERE id = " + id;', state: "bad" },
              { n: 32, code: "  return db.query(query);" },
            ]}
          />
          <AnimatePresence>
            {shown ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
          <CodePanel
                file="After"
                status="Patched"
                lines={[
                  { n: 30, code: "function getUser(id) {" },
                  { n: 31, code: '  const query = "SELECT * FROM users WHERE id = ?";', state: "good" },
                  { n: 32, code: "  return db.query(query, [id]);", state: "good" },
                ]}
              />
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="panel flex items-center gap-3 rounded-md px-5 py-4"
              >
                <span className="size-2 rounded-full bg-success shadow-[0_0_12px_2px_currentColor]" />
                <div>
                  <div className="font-display text-sm font-bold">Vulnerability resolved</div>
                  <div className="label-mono mt-0.5">Re-scan clean · verified 12s ago</div>
                </div>
              </motion.div>
              </motion.div>
            ) : (
              <div className="panel flex min-h-[120px] items-center justify-center rounded-md">
                <p className="font-mono text-xs text-muted-foreground">
                  Patched version hidden — press “See the diff”
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageFrame>
  );
}
