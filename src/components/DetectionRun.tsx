import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { bug, scanSteps } from "@/lib/bug-data";
import { CodePanel } from "./CodePanel";

const sample = [
  { n: 28, code: "app.get('/user/:id', (req, res) => {" },
  { n: 29, code: "  res.json(getUser(req.params.id));" },
  { n: 30, code: "});" },
  { n: 31, code: '  const query = "SELECT * FROM users WHERE id = " + id;' },
  { n: 32, code: "  return db.query(query);" },
];

export function DetectionRun() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const start = () => {
    if (running) return;
    setDone(false);
    setProgress(0);
    setRunning(true);
    timer.current = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 2;
        if (next >= 100) {
          if (timer.current) window.clearInterval(timer.current);
          setRunning(false);
          setDone(true);
          return 100;
        }
        return next;
      });
    }, 45);
  };

  const stepsDone = Math.floor((progress / 100) * scanSteps.length);
  const scannedLine = Math.min(
    sample.length - 1,
    Math.floor((progress / 100) * sample.length),
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-hunt" onClick={start} disabled={running}>
            {running ? "Hunting…" : done ? "Hunt again" : "Start hunting"}
            <span className="size-1.5 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
          </button>
          <span className="label-mono">{bug.file}</span>
        </div>

        <div className="mt-8 max-w-md">
          <div className="label-mono flex justify-between">
            <span>{done ? "Scan complete" : running ? "Scanning codebase…" : "Idle"}</span>
            <span className="text-magenta">{progress}%</span>
          </div>
          <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet to-magenta transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="mt-8 space-y-2.5">
          {scanSteps.map((s, i) => {
            const complete = i < stepsDone || done;
            return (
              <li key={s.label} className="flex items-center gap-3 font-mono text-xs">
                <span
                  className={`size-1.5 rounded-full ${
                    complete ? "bg-success" : running && i === stepsDone ? "bg-magenta" : "bg-border"
                  }`}
                />
                <span className={complete ? "text-foreground" : "text-muted-foreground/60"}>
                  {s.label}
                </span>
                <span className="ml-auto text-muted-foreground/60">
                  {complete ? s.detail : running && i === stepsDone ? "…" : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="space-y-5">
        <div className="relative">
          <CodePanel
            file={bug.file}
            status={done ? "Vulnerable" : running ? "Scanning" : "Sample"}
            lines={sample.map((l, i) => {
              const state =
                done && l.n === bug.line ? "bad" : running && i === scannedLine ? "dim" : null;
              return state ? { ...l, state } : { ...l };
            })}
          />
          {running ? (
            <motion.div
              aria-hidden
              initial={{ top: "12%" }}
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-x-0 h-px bg-magenta shadow-[0_0_14px_3px_oklch(0.66_0.26_340/0.6)]"
            />
          ) : null}
        </div>

        <AnimatePresence>
          {done ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel rounded-md p-5"
            >
              <div className="flex items-center gap-3">
                <span className="size-2 rounded-full bg-destructive shadow-[0_0_12px_2px_currentColor]" />
                <span className="font-mono text-[0.62rem] tracking-[0.22em] text-destructive uppercase">
                  {bug.severity} · {bug.cwe}
                </span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold">{bug.type}</h2>
              <div className="mt-5 grid grid-cols-2 gap-5 border-t border-border pt-4 sm:grid-cols-4">
                {[
                  ["Bug type", bug.type],
                  ["Severity", bug.severity],
                  ["Line", String(bug.line)],
                  ["Confidence", `${bug.confidence}%`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="label-mono">{k}</div>
                    <div className="mt-1 font-mono text-sm text-foreground">{v}</div>
                  </div>
                ))}
              </div>
              <Link to="/understand" className="btn-ghost-line mt-6 inline-flex">
                Why was this flagged? →
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
