import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BatButton } from "@/components/bat-button";
import { useCaveStore } from "@/lib/cave-store";
import type { Threat } from "@/lib/types";
import { formatStamp } from "@/lib/utils";

export const Route = createFileRoute("/_cave/watch")({
  component: Watch,
});

const THREATS: Threat[] = ["low", "moderate", "high", "critical"];

function Watch() {
  const journal = useCaveStore((s) => s.journal);
  const addJournal = useCaveStore((s) => s.addJournal);
  const removeJournal = useCaveStore((s) => s.removeJournal);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [threat, setThreat] = useState<Threat>("low");

  function submit() {
    if (!title.trim() && !body.trim()) return;
    addJournal({ title: title.trim() || "Watch note", body, threat });
    setTitle("");
    setBody("");
    setThreat("low");
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
      <header>
        <p className="label-kicker">Night watch</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Write what happened.</h1>
      </header>

      <section className="panel p-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-transparent type-display text-2xl outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="The city, the work, the weather in your head."
          className="mt-4 w-full bg-transparent text-sm leading-relaxed outline-none"
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {THREATS.map((t) => (
            <BatButton
              key={t}
              label={t}
              variant="inline"
              active={threat === t}
              onClick={() => setThreat(t)}
            />
          ))}
          <BatButton label="Log it" variant="inline" onClick={submit} />
        </div>
      </section>

      <ol className="flex flex-col gap-3">
        {journal.map((entry) => (
          <li key={entry.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label-kicker">{entry.threat}</p>
                <h2 className="mt-1 text-xl">{entry.title}</h2>
              </div>
              <BatButton
                label="Remove"
                variant="compact"
                onClick={() => removeJournal(entry.id)}
              />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg">
              {entry.body}
            </p>
            <p className="mt-3 text-[0.65rem] tracking-[0.16em] text-faint uppercase tabular">
              {formatStamp(entry.at)}
            </p>
          </li>
        ))}
      </ol>
    </main>
  );
}
