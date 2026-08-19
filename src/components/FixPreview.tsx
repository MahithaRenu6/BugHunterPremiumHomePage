import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CodePanel } from "./CodePanel";

const before = [
  { n: 30, code: "function getUser(id) {" },
  { n: 31, code: '  const query = "SELECT * FROM users WHERE id = " + id;', state: "bad" as const },
  { n: 32, code: "  return db.query(query);" },
  { n: 33, code: "}" },
];

const after = [
  { n: 30, code: "function getUser(id) {" },
  { n: 31, code: '  const query = "SELECT * FROM users WHERE id = ?";', state: "good" as const },
  { n: 32, code: "  return db.query(query, [id]);", state: "good" as const },
  { n: 33, code: "}" },
];

export function FixPreview() {
  const [stage, setStage] = useState<"idle" | "preview" | "applied">("idle");

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <span className="label-mono mb-2 block text-destructive">Before</span>
          <CodePanel file="src/api/auth.js" status="Vulnerable" lines={before} />
        </div>

        <div>
          <span className="label-mono mb-2 block text-success">After</span>
          <AnimatePresence mode="wait">
            {stage === "idle" ? (
              <motion.div
                key="locked"
                exit={{ opacity: 0 }}
                className="panel flex h-full min-h-[168px] items-center justify-center rounded-md"
              >
                <p className="font-mono text-xs text-muted-foreground">
                  Fix hidden — run a preview
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="fix"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <CodePanel
                  file="src/api/auth.js"
                  status={stage === "applied" ? "Patched" : "Proposed"}
                  lines={after}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          className="btn-hunt"
          onClick={() => setStage(stage === "idle" ? "preview" : "applied")}
          disabled={stage === "applied"}
        >
          {stage === "idle" ? "Preview fix" : stage === "preview" ? "Apply fix" : "Fix applied"}
          <span className="size-1.5 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
        </button>
        {stage !== "idle" ? (
          <button className="btn-ghost-line" onClick={() => setStage("idle")}>
            Reset
          </button>
        ) : null}

        <AnimatePresence>
          {stage === "applied" ? (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-xs text-success"
            >
              ✓ Parameterised query applied · risk cleared
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
