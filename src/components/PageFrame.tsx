import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { SiteNav } from "./SiteNav";

const order = ["/", "/scan", "/found", "/understand", "/fixed", "/ready"] as const;

export function PageFrame({
  index,
  kicker,
  children,
  footer,
}: {
  index: number;
  kicker: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const next = order[index] ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="grid-veil pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent,oklch(0.09_0.03_300)_75%)]" />

      <SiteNav />

      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 pt-28 pb-16 md:px-12"
      >
        <span className="label-mono block">
          {String(index).padStart(2, "0")} — {kicker}
        </span>
        {children}
      </motion.main>

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 pb-8 md:px-12">
        <span className="label-mono">© 2026 BugHunter — all rights reserved</span>
        {footer ??
          (next ? (
            <Link to={next} className="btn-ghost-line">
              Next <span aria-hidden>→</span>
            </Link>
          ) : null)}
      </div>
    </div>
  );
}
