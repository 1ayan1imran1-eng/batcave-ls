import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { OrbitingBats } from "@/components/css-3d";
import { useCaveStore } from "@/lib/cave-store";
import {
  ageYears,
  birthDate,
  countdownTo,
  isBirthday,
  livedFor,
  nextBirthday,
  turningAge,
} from "@/lib/birthday";

export const Route = createFileRoute("/_cave/birthday")({
  component: Birthday,
});

function Birthday() {
  const [now, setNow] = useState(() => new Date());
  const notes = useCaveStore((s) => s.yearNotes);
  const setYearNote = useCaveStore((s) => s.setYearNote);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(t);
  }, []);

  const cd = countdownTo(nextBirthday(now), now);
  const lived = livedFor(now);
  const years = useMemo(() => {
    const list = [];
    for (let y = 2008; y <= now.getFullYear() + 1; y++) list.push(y);
    return list;
  }, [now]);
  const [openYear, setOpenYear] = useState(turningAge(now) + 2008 - 1);

  const units = [
    { k: "Days", v: cd.days },
    { k: "Hours", v: cd.hours },
    { k: "Minutes", v: cd.minutes },
    { k: "Seconds", v: cd.seconds },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-6 sm:px-8 sm:py-10">
      <header className="text-center">
        <p className="label-kicker">
          {isBirthday(now) ? "Protocol complete" : "The 18th protocol"}
        </p>
        <h1 className="mt-3 text-4xl sm:text-6xl">
          {isBirthday(now) ? "It is the day." : "Eighteen approaches."}
        </h1>
        <p className="mt-4 text-muted">
          Born 2 December 2008. Age {ageYears(now)}. Next mark: {turningAge(now)}.
        </p>
      </header>

      <OrbitingBats />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {units.map((u) => (
          <article key={u.k} className="panel px-3 py-5 text-center">
            <p className="type-display text-4xl tabular sm:text-5xl">{u.v}</p>
            <p className="label-kicker mt-2">{u.k}</p>
          </article>
        ))}
      </section>

      <section className="panel grid gap-6 p-5 sm:grid-cols-3 sm:p-8">
        <Stat label="Years lived" value={String(lived.years)} />
        <Stat label="Nights counted" value={lived.days.toLocaleString()} />
        <Stat
          label="Origin"
          value={birthDate().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        />
      </section>

      <section>
        <p className="label-kicker mb-4">Year files</p>
        <div className="flex flex-wrap gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setOpenYear(y)}
              className="h-11 min-w-11 border border-line px-2 text-xs tabular tracking-wider text-muted transition-colors duration-150 hover:border-accent hover:text-fg data-[on=true]:border-accent data-[on=true]:text-accent-hot"
              data-on={openYear === y}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="panel mt-4 p-4">
          <p className="label-kicker mb-2">{openYear}</p>
          <textarea
            value={notes.find((n) => n.year === openYear)?.body ?? ""}
            onChange={(e) => setYearNote(openYear, e.target.value)}
            rows={5}
            className="w-full bg-transparent text-sm leading-relaxed outline-none"
            placeholder="What this year was. What it must become."
          />
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-kicker">{label}</p>
      <p className="mt-2 type-display text-2xl tabular">{value}</p>
    </div>
  );
}
