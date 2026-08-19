import { motion } from "motion/react";

export type CodeLine = { n: number; code: string; state?: "bad" | "good" | "dim" };

export function CodePanel({
  file,
  status,
  lines,
  className = "",
}: {
  file: string;
  status?: string;
  lines: CodeLine[];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className={`panel rounded-md ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-[0.7rem] text-muted-foreground">{file}</span>
        {status ? (
          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-magenta uppercase">
            {status}
          </span>
        ) : null}
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[0.72rem] leading-6">
        {lines.map((l) => (
          <div
            key={l.n}
            className={
              l.state === "bad"
                ? "-mx-4 border-l-2 border-destructive bg-destructive/12 px-4"
                : l.state === "good"
                  ? "-mx-4 border-l-2 border-success bg-success/10 px-4"
                  : ""
            }
          >
            <span className="mr-4 inline-block w-5 text-right text-muted-foreground/60 select-none">
              {l.n}
            </span>
            <span className={l.state === "dim" ? "text-muted-foreground" : "text-foreground/90"}>
              {l.code}
            </span>
          </div>
        ))}
      </pre>
    </motion.div>
  );
}
