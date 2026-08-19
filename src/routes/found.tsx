import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageFrame } from "@/components/PageFrame";
import { CodePanel } from "@/components/CodePanel";

export const Route = createFileRoute("/found")({
  head: () => ({
    meta: [
      { title: "We found it — BugHunter vulnerability report" },
      {
        name: "description",
        content:
          "A critical SQL injection detected in your code, with line, confidence and severity.",
      },
      { property: "og:title", content: "We found it — BugHunter vulnerability report" },
      {
        property: "og:description",
        content: "Precise findings: file, line, confidence score and category.",
      },
    ],
  }),
  component: Found,
});

function Found() {
  return (
    <PageFrame index={3} kicker="Discovery">
      <div className="relative grid flex-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="display-xl">
            We
            <br />
            found it.
          </h1>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A critical vulnerability has been detected in your code.
          </p>
          <Link to="/understand" className="btn-ghost-line mt-10 inline-flex">
            View details →
          </Link>
        </div>

        <div className="space-y-4">
          <CodePanel
            file="auth.js"
            status="Vulnerable"
            lines={[
              { n: 30, code: "function getUser(id) {" },
              { n: 31, code: '  const query = "SELECT * FROM users WHERE id = " + id;', state: "bad" },
              { n: 32, code: "  return db.query(query);" },
              { n: 33, code: "}" },
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="panel rounded-md p-5"
          >
            <div className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-destructive shadow-[0_0_12px_2px_currentColor]" />
              <span className="font-mono text-[0.62rem] tracking-[0.22em] text-destructive uppercase">
                Critical
              </span>
            </div>
            <h2 className="mt-3 font-display text-xl font-bold">SQL Injection</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              User-controlled input is directly concatenated into a SQL query, allowing an attacker
              to read or destroy your database.
            </p>
            <div className="mt-5 flex flex-wrap gap-6 border-t border-border pt-4">
              {[
                ["Line", "31"],
                ["Confidence", "98%"],
                ["Category", "Security"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="label-mono">{k}</div>
                  <div className="mt-1 font-mono text-sm text-foreground">{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageFrame>
  );
}
