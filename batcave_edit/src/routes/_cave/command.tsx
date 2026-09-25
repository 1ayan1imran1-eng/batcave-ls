import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BatButton } from "@/components/bat-button";
import { useCaveStore } from "@/lib/cave-store";
import { ageYears, countdownTo, nextBirthday, turningAge } from "@/lib/birthday";
import { formatStamp } from "@/lib/utils";
import { TYPE_META } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_cave/command")({
  component: Command,
});

function Command() {
  const name = useCaveStore((s) => s.settings.operatorName);
  const projects = useCaveStore((s) => s.projects);
  const journal = useCaveStore((s) => s.journal);
  const [now, setNow] = useState(() => new Date());
  const [signal, setSignal] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const cd = countdownTo(nextBirthday(now), now);
  const recent = [...projects].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-kicker">Command center</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Welcome back, {name}.</h1>
        </div>
        <div className="text-right">
          <p className="label-kicker">Gotham clock</p>
          <p className="tabular text-2xl text-fg">
            {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>
      </header>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <p className="label-kicker">The command wall</p>
            <p className="mt-1 text-sm text-muted">A live overview of the cave systems.</p>
          </div>
          <BatButton
            label={signal ? "Signal on" : "Signal off"}
            variant="inline"
            active={signal}
            onClick={() => setSignal((v) => !v)}
          />
        </div>
        <div className="relative overflow-hidden bg-inset p-5 sm:p-8">
          <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
            <div className="relative min-h-[250px] overflow-hidden rounded-sm border border-line bg-black p-5">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgb(180 35 35 / .12) 1px, transparent 1px), linear-gradient(90deg, rgb(180 35 35 / .12) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <p className="label-kicker text-accent">BAT-COMMAND / ONLINE</p>
                  <span className={cn("h-2 w-2 rounded-full", signal ? "bg-accent ember-glow" : "bg-muted")} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["FILES", String(projects.length)],
                    ["JOURNAL", String(journal.length)],
                    ["SIGNAL", signal ? "ACTIVE" : "OFF"],
                  ].map(([label, value]) => (
                    <div key={label} className="border border-line bg-surface/80 p-3">
                      <p className="label-kicker">{label}</p>
                      <p className="mt-2 text-lg tabular text-fg">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border border-line bg-surface p-5">
              <p className="label-kicker">System status</p>
              <div className="mt-5 space-y-4 text-sm">
                {[["Vault", "READY"], ["Project editor", "READY"], ["Roadmap canvas", "READY"], ["Remote sync", "CONFIGURABLE"]].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
                    <span className="text-muted">{label}</span>
                    <span className="tabular text-accent">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="panel p-5">
          <p className="label-kicker">18th protocol</p>
          <p className="mt-3 type-display text-4xl tabular text-fg">
            {cd.days}
            <span className="ml-2 text-base tracking-normal text-muted">days</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Age {ageYears(now)}. Turning {turningAge(now)} on 2 Dec.
          </p>
          <Link
            to="/birthday"
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-line bg-raised px-3 py-2 text-xs font-semibold tracking-[0.18em] text-fg uppercase transition-colors duration-150 hover:border-accent"
          >
            Open protocol
          </Link>
        </article>
        <article className="panel p-5">
          <p className="label-kicker">Vault</p>
          <p className="mt-3 type-display text-4xl tabular">{projects.length}</p>
          <p className="mt-2 text-sm text-muted">Active files in the ring.</p>
          <Link
            to="/vault"
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-line bg-raised px-3 py-2 text-xs font-semibold tracking-[0.18em] text-fg uppercase transition-colors duration-150 hover:border-accent"
          >
            Enter vault
          </Link>
        </article>
        <article className="panel p-5">
          <p className="label-kicker">Last watch</p>
          <p className="mt-3 text-lg text-fg">
            {journal[0]?.title ?? "No entry"}
          </p>
          <p className="mt-2 text-sm text-muted">
            {journal[0] ? formatStamp(journal[0].at) : "Write the night down."}
          </p>
          <Link
            to="/watch"
            className="mt-4 inline-flex items-center gap-2 rounded-sm border border-line bg-raised px-3 py-2 text-xs font-semibold tracking-[0.18em] text-fg uppercase transition-colors duration-150 hover:border-accent"
          >
            Open watch
          </Link>
        </article>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="label-kicker">Recent files</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {recent.map((p) => (
            <Link
              key={p.id}
              to="/vault/$id"
              params={{ id: p.id }}
              className="panel p-4 transition-colors duration-150 hover:border-accent"
            >
              <p className="label-kicker text-accent">{TYPE_META[p.type].label}</p>
              <h2 className="mt-2 text-lg">{p.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
