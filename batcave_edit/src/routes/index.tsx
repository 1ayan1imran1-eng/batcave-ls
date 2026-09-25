import { createFileRoute, Navigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { BatEmblem3D } from "@/components/bat-emblem";
import { BatButton } from "@/components/bat-button";
import { BootScreen } from "@/components/boot-screen";
import { LightningFlash, RainLayer } from "@/components/rain-layer";
import { useCaveStore } from "@/lib/cave-store";
import { setRainAudio } from "@/lib/rain-audio";

export const Route = createFileRoute("/")({ component: Gate });

function Gate() {
  const hydrated = useCaveStore((s) => s.hydrated);
  const unlocked = useCaveStore((s) => s.unlocked);
  const hasHash = useCaveStore((s) => Boolean(s.settings.accessHash));
  const rain = useCaveStore((s) => s.settings.rainAudio);
  const unlock = useCaveStore((s) => s.unlock);
  const patchSettings = useCaveStore((s) => s.patchSettings);
  const [locator, setLocator] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hydrated && rain) void setRainAudio(true);
  }, [hydrated, rain]);

  if (!hydrated) return <BootScreen />;
  if (unlocked && hasHash) return <Navigate to="/command" />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (locator.trim().toLowerCase() !== "84fd6e98") {
      setError("Unknown cave identifier.");
      return;
    }
    setBusy(true);
    try {
      const ok = await unlock(code);
      if (!ok) setError("Access denied.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="cave-shell vignette scanlines relative min-h-dvh overflow-hidden">
      <RainLayer />
      <LightningFlash />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center px-5 py-12">
        <div className="scene-3d mb-8 h-28 w-56" style={{ animation: "bat-float 6s var(--ease-smooth) infinite" }}>
          <div className="preserve-3d relative h-full w-full"><BatEmblem3D className="h-full w-full" /></div>
        </div>
        <p className="label-kicker mb-3">Restricted uplink</p>
        <h1 className="text-center text-4xl tracking-[0.28em] text-fg sm:text-5xl">THE BATCAVE</h1>
        <p className="mt-4 max-w-sm text-center text-sm text-muted">
          Single-operator system. Identify the cave, then enter the access code.
        </p>
        <form onSubmit={onSubmit} className="panel mt-10 w-full space-y-4 p-5 sm:p-6">
          <Field label="Cave identifier" value={locator} onChange={setLocator} placeholder="84fd6e98" autoComplete="off" />
          <Field label="Access code" value={code} onChange={setCode} type="password" autoComplete="current-password" />
          {error ? <p className="text-sm text-accent-hot" role="alert">{error}</p> : null}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <BatButton label={busy ? "Authenticating…" : "Enter the cave"} variant="inline" disabled={busy} className="px-5 py-3" type="submit" />
            <BatButton label={rain ? "Rain on" : "Rain off"} variant="compact" active={rain} onClick={() => { const next = !rain; patchSettings({ rainAudio: next }); void setRainAudio(next); }} />
          </div>
        </form>
        <p className="mt-8 text-center text-[0.65rem] tracking-[0.18em] text-faint uppercase">One account · Operator: Shameer</p>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="block" htmlFor={id}>
      <span className="label-kicker">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full bg-inset px-3 text-sm text-fg outline-none ring-1 ring-line focus:ring-accent"
      />
    </label>
  );
}
