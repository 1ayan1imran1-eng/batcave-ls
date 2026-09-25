import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { BatButton } from "@/components/bat-button";
import { useCaveStore } from "@/lib/cave-store";
import { setRainAudio } from "@/lib/rain-audio";
import type { CaveSnapshot } from "@/lib/types";

export const Route = createFileRoute("/_cave/settings")({
  component: Settings,
});

function Settings() {
  const settings = useCaveStore((s) => s.settings);
  const patchSettings = useCaveStore((s) => s.patchSettings);
  const changeCode = useCaveStore((s) => s.changeCode);
  const exportSnapshot = useCaveStore((s) => s.exportSnapshot);
  const importSnapshot = useCaveStore((s) => s.importSnapshot);
  const wipe = useCaveStore((s) => s.wipe);
  const fileRef = useRef<HTMLInputElement>(null);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState("");

  async function onCode() {
    const ok = await changeCode(current, next);
    setMsg(ok ? "Access code rotated." : "Current code was wrong.");
    if (ok) {
      setCurrent("");
      setNext("");
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(exportSnapshot(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batcave.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
      <header>
        <p className="label-kicker">System</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Cave configuration.</h1>
      </header>

      <section className="panel space-y-4 p-5">
        <p className="label-kicker">Operator</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-inset p-3"><p className="text-[0.65rem] uppercase tracking-[0.18em] text-faint">Name</p><p className="mt-1 text-sm text-fg">Shameer</p></div>
          <div className="bg-inset p-3"><p className="text-[0.65rem] uppercase tracking-[0.18em] text-faint">Cave ID</p><p className="mt-1 font-mono text-sm text-fg">84fd6e98</p></div>
        </div>
        <p className="text-xs text-muted">This build has one operator only. There is no account creation or multi-user system.</p>
        <BatButton
          label={settings.rainAudio ? "Rain on" : "Rain off"}
          variant="inline"
          active={settings.rainAudio}
          onClick={() => {
            const rainAudio = !settings.rainAudio;
            patchSettings({ rainAudio });
            void setRainAudio(rainAudio);
          }}
        />
      </section>

      <section className="panel space-y-3 p-5">
        <p className="label-kicker">Access code</p>
        <input
          type="password"
          value={current}
          placeholder="Current"
          onChange={(e) => setCurrent(e.target.value)}
          className="h-11 w-full bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
        />
        <input
          type="password"
          value={next}
          placeholder="New code"
          onChange={(e) => setNext(e.target.value)}
          className="h-11 w-full bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
        />
        <BatButton label="Rotate code" variant="inline" onClick={() => void onCode()} />
        {msg ? <p className="text-sm text-muted">{msg}</p> : null}
      </section>

      <section className="panel space-y-3 p-5">
        <p className="label-kicker">Backup</p>
        <div className="flex flex-wrap gap-2">
          <BatButton label="Export JSON" variant="inline" onClick={download} />
          <BatButton
            label="Import JSON"
            variant="inline"
            onClick={() => fileRef.current?.click()}
          />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const text = await file.text();
            try {
              const snap = JSON.parse(text) as CaveSnapshot;
              importSnapshot(snap);
              setMsg("Imported.");
            } catch {
              setMsg("That file was not a cave backup.");
            }
          }}
        />
        <BatButton
          label="Wipe cave"
          variant="inline"
          onClick={() => {
            if (confirm("Destroy everything in this cave?")) wipe();
          }}
        />
      </section>
    </main>
  );
}
