import { Link, useRouterState } from "@tanstack/react-router";
import { BatEmblem } from "./bat-emblem";
import { BatButton } from "./bat-button";
import { useCaveStore } from "@/lib/cave-store";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PRIMARY = [
  { to: "/command", label: "Command" },
  { to: "/vault", label: "Vault" },
  { to: "/birthday", label: "Protocol" },
  { to: "/watch", label: "Watch" },
] as const;

const MORE = [
  { to: "/intel", label: "Intel" },
  { to: "/training", label: "Strike" },
  { to: "/settings", label: "System" },
] as const;

function NavBat({
  to,
  label,
  on,
  className,
}: {
  to: string;
  label: string;
  on: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      data-active={on ? "true" : "false"}
      className={cn("bat-btn min-w-[4.5rem] px-1 py-2", className)}
    >
      <BatEmblem className="h-[1.35rem] w-[2.9rem] fill-current sm:h-6 sm:w-14" />
      <span className="text-[0.62rem] font-semibold tracking-[0.22em] uppercase">
        {label}
      </span>
    </Link>
  );
}

export function CaveNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const name = useCaveStore((s) => s.settings.operatorName);
  const lock = useCaveStore((s) => s.lock);
  const [more, setMore] = useState(false);

  function active(to: string) {
    return pathname === to || pathname.startsWith(`${to}/`);
  }

  return (
    <>
      <aside className="hidden lg:flex w-[6.5rem] shrink-0 flex-col items-center border-r border-line bg-surface/80 py-6">
        <Link to="/command" className="mb-8 text-accent-hot" aria-label="Command">
          <BatEmblem className="h-7 w-16 fill-current" />
        </Link>
        <nav className="flex flex-1 flex-col items-center gap-1">
          {PRIMARY.map((item) => (
            <NavBat
              key={item.to}
              to={item.to}
              label={item.label}
              on={active(item.to)}
            />
          ))}
          {MORE.map((item) => (
            <NavBat
              key={item.to}
              to={item.to}
              label={item.label}
              on={active(item.to)}
            />
          ))}
        </nav>
        <div className="mt-4 flex flex-col items-center gap-3">
          <p className="max-w-[5.5rem] truncate text-center text-[0.6rem] tracking-[0.18em] text-muted uppercase">
            {name}
          </p>
          <BatButton label="Lock" variant="compact" onClick={lock} />
        </div>
      </aside>

      <header className="flex lg:hidden items-center justify-between border-b border-line bg-surface/90 px-3 py-2">
        <Link to="/command" className="flex items-center gap-2 text-accent-hot">
          <BatEmblem className="h-5 w-12 fill-current" />
          <span className="type-display text-sm tracking-[0.2em] text-fg">
            THE CAVE
          </span>
        </Link>
        <BatButton label="Lock" variant="compact" onClick={lock} />
      </header>

      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-end justify-around border-t border-line bg-surface/95 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1">
        {PRIMARY.map((item) => (
          <NavBat
            key={item.to}
            to={item.to}
            label={item.label}
            on={active(item.to)}
            className="flex-1"
          />
        ))}
        <div className="relative flex-1">
          <BatButton
            label="More"
            active={more || MORE.some((m) => active(m.to))}
            className="w-full"
            onClick={() => setMore((v) => !v)}
          />
          {more ? (
            <div className="absolute bottom-[4.6rem] right-1 w-40 panel p-2">
              {MORE.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMore(false)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-2 text-xs tracking-[0.18em] uppercase",
                    active(item.to) ? "text-accent-hot" : "text-muted",
                  )}
                >
                  <BatEmblem className="h-3 w-7 fill-current" />
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </nav>
    </>
  );
}
