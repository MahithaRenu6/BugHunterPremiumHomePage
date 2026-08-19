import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageFrame } from "@/components/PageFrame";
import { ParticleOrb } from "@/components/ParticleOrb";
import { BugCreature } from "@/components/BugCreature";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BugHunter — Hunt the bug before your users do" },
      {
        name: "description",
        content:
          "BugHunter AI scans your code, finds vulnerabilities, explains them and shows the safest way to fix.",
      },
      { property: "og:title", content: "BugHunter — Hunt the bug before your users do" },
      {
        property: "og:description",
        content: "AI code security that finds, explains and fixes vulnerabilities.",
      },
    ],
  }),
  component: Hunt,
});

function Hunt() {
  return (
    <PageFrame index={1} kicker="Hunt">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:left-1/4">
        <ParticleOrb className="h-[110vh] w-[110vw] max-w-[1100px]" intensity={1} />
        <div className="absolute inset-0 flex items-center justify-center"><BugCreature className="h-[95vh] w-[95vw] max-w-[820px]" /></div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl max-w-[14ch]"
        >
          Hunt
          <br />
          the bug
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="glow-magenta mt-4 font-display text-lg font-bold tracking-[0.08em] text-magenta uppercase"
        >
          Before your users do.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground"
        >
          BugHunter AI analyses your code, finds vulnerabilities, explains them in plain language
          and shows the safest way to fix.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-10"
        >
          <Link to="/scan" className="btn-hunt">
            Start hunting <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <div className="mt-16 flex items-end gap-4">
          <span className="font-mono text-2xl text-magenta">01</span>
          <span className="label-mono pb-1">Built for developers</span>
        </div>
      </div>
    </PageFrame>
  );
}
