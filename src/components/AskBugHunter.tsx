import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { askAnswers } from "@/lib/bug-data";

type Turn = { q: string; a: string };

export function AskBugHunter() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");

  const ask = (q: string) => {
    const match =
      askAnswers.find((a) => a.q.toLowerCase() === q.toLowerCase()) ??
      askAnswers.find((a) =>
        q
          .toLowerCase()
          .split(/\s+/)
          .some((w) => w.length > 4 && a.q.toLowerCase().includes(w)),
      );
    const a =
      match?.a ??
      "I only have the demo finding indexed right now — the SQL injection in src/api/auth.js line 31. Try one of the suggested questions.";
    setTyping(true);
    setTurns((t) => [...t, { q, a: "" }]);
    window.setTimeout(() => {
      setTurns((t) => t.map((turn, i) => (i === t.length - 1 ? { ...turn, a } : turn)));
      setTyping(false);
    }, 700);
  };

  return (
    <div className="panel mx-auto w-full max-w-3xl rounded-md">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="label-mono">Ask BugHunter</span>
        <span className="flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.2em] text-magenta uppercase">
          <span className="size-1.5 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
          online
        </span>
      </div>

      <div className="max-h-[340px] min-h-[180px] space-y-5 overflow-y-auto px-5 py-6">
        {turns.length === 0 ? (
          <p className="font-mono text-xs text-muted-foreground">
            Ask your codebase anything about this finding.
          </p>
        ) : null}

        <AnimatePresence initial={false}>
          {turns.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-end">
                <p className="max-w-[80%] rounded-md bg-secondary px-4 py-2.5 text-sm">{t.q}</p>
              </div>
              <div className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
                <p className="max-w-[85%] text-sm leading-relaxed text-muted-foreground">
                  {t.a || (
                    <span className="font-mono text-xs text-magenta">analysing…</span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {askAnswers.map((a) => (
            <button
              key={a.q}
              disabled={typing}
              onClick={() => ask(a.q)}
              className="rounded-full border border-border px-3 py-1.5 font-mono text-[0.68rem] text-muted-foreground transition-colors hover:border-magenta hover:text-foreground disabled:opacity-40"
            >
              {a.q}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim() || typing) return;
            ask(draft.trim());
            setDraft("");
          }}
          className="mt-4 flex items-center gap-3 border-t border-border pt-4"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask your codebase…"
            className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <button type="submit" className="btn-hunt" disabled={typing}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
