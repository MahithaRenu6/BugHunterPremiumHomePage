import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Product" },
  { to: "/scan", label: "How it works" },
  { to: "/found", label: "Detection" },
  { to: "/understand", label: "Docs" },
  { to: "/fixed", label: "Fixes" },
] as const;

export function SiteNav() {
  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12">
      <Link to="/" className="font-display text-sm font-extrabold tracking-[0.18em] uppercase">
        BugHunter
        <sup className="ml-0.5 font-mono text-[0.5rem] text-magenta">AI</sup>
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="label-mono transition-colors hover:text-foreground"
            activeProps={{ className: "label-mono text-foreground" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <Link to="/ready" className="btn-hunt">
        Start hunting
        <span className="size-1.5 rounded-full bg-magenta shadow-[0_0_10px_2px_currentColor]" />
      </Link>
    </header>
  );
}
