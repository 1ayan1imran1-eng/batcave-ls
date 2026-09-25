import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BatButton } from "@/components/bat-button";
import { Skyline } from "@/components/css-3d";
import { useCaveStore } from "@/lib/cave-store";
import type { AllyStatus } from "@/lib/types";

export const Route = createFileRoute("/_cave/intel")({
  component: Intel,
});

const STATUSES: AllyStatus[] = ["ally", "neutral", "watch"];

function Intel() {
  const intel = useCaveStore((s) => s.intel);
  const addIntel = useCaveStore((s) => s.addIntel);
  const updateIntel = useCaveStore((s) => s.updateIntel);
  const removeIntel = useCaveStore((s) => s.removeIntel);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
      <header>
        <p className="label-kicker">Intel</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">The city and its names.</h1>
      </header>
      <div className="panel overflow-hidden">
        <Skyline />
      </div>

      <section className="panel grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label>
          <span className="label-kicker">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 w-full bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
          />
        </label>
        <label>
          <span className="label-kicker">Role</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-2 h-11 w-full bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
          />
        </label>
        <BatButton
          label="Add name"
          variant="inline"
          className="h-11"
          onClick={() => {
            if (!name.trim()) return;
            addIntel({
              name: name.trim(),
              role: role.trim() || "Unknown",
              notes: "",
              status: "neutral",
            });
            setName("");
            setRole("");
          }}
        />
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {intel.map((c) => (
          <article key={c.id} className="panel p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <input
                  value={c.name}
                  onChange={(e) => updateIntel(c.id, { name: e.target.value })}
                  className="type-display bg-transparent text-xl outline-none"
                />
                <input
                  value={c.role}
                  onChange={(e) => updateIntel(c.id, { role: e.target.value })}
                  className="mt-1 block w-full bg-transparent text-xs tracking-[0.18em] text-muted uppercase outline-none"
                />
              </div>
              <BatButton
                label="Remove"
                variant="compact"
                onClick={() => removeIntel(c.id)}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {STATUSES.map((st) => (
                <BatButton
                  key={st}
                  label={st}
                  variant="inline"
                  active={c.status === st}
                  onClick={() => updateIntel(c.id, { status: st })}
                />
              ))}
            </div>
            <textarea
              value={c.notes}
              onChange={(e) => updateIntel(c.id, { notes: e.target.value })}
              rows={3}
              className="mt-3 w-full bg-transparent text-sm outline-none"
              placeholder="Notes"
            />
          </article>
        ))}
      </div>
    </main>
  );
}
