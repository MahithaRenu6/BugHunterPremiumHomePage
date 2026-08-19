import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageFrame } from "@/components/PageFrame";
import { TechGlobe } from "@/components/TechGlobe";


export const Route = createFileRoute("/ready")({
  head: () => ({
    meta: [
      { title: "Ready to hunt? — Start with BugHunter" },
      {
        name: "description",
        content: "Paste your code, run a scan, and let BugHunter do the rest. Secure code, faster.",
      },
      { property: "og:title", content: "Ready to hunt? — Start with BugHunter" },
      {
        property: "og:description",
        content: "Run your first AI security scan in under a minute.",
      },
    ],
  }),
  component: Ready,
});

function Ready() {
  return (
    <PageFrame index={6} kicker="Launch">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center lg:left-1/4">
        <TechGlobe className="h-[90vh] w-[90vw] max-w-[760px]" />
      </div>


      <div className="relative grid flex-1 items-center gap-12 lg:grid-cols-[1fr_0.7fr]">
        <div>
          <h1 className="display-xl">
            Ready to
            <br />
            <span className="glow-magenta text-magenta">hunt?</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Paste your code. Run a scan. Let BugHunter do the rest.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/scan" className="btn-hunt">
              Start your hunt <span aria-hidden>→</span>
            </Link>
            <Link to="/found" className="btn-ghost-line">
              Secure code →
            </Link>
          </div>
        </div>

        <ul className="ml-auto w-full max-w-[15rem] space-y-3">
          {["Smart AI", "Deep analysis", "Zero config", "Private by default"].map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
              className="panel flex items-center gap-3 rounded-full px-4 py-2.5"
            >
              <span className="size-1.5 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
              <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase">{f}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </PageFrame>
  );
}
