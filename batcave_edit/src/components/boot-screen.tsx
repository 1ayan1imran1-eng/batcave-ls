import { BatEmblem } from "./bat-emblem";

export function BootScreen({ label = "THE BATCAVE" }: { label?: string }) {
  return (
    <div className="cave-shell flex min-h-dvh flex-col items-center justify-center gap-6">
      <BatEmblem className="h-10 w-24 fill-accent animate-pulse" />
      <p className="type-display text-xl tracking-[0.42em] text-fg">{label}</p>
      <p className="label-kicker">Establishing uplink</p>
    </div>
  );
}
