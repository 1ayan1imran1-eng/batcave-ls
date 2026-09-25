export function RainLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-1 overflow-hidden"
      aria-hidden
    >
      <div className="rain-sheet" />
      <div className="rain-sheet rain-sheet-slow" />
    </div>
  );
}

export function LightningFlash() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-2 bg-bone/40"
      style={{ animation: "lightning 7.5s var(--ease-out) infinite" }}
      aria-hidden
    />
  );
}
