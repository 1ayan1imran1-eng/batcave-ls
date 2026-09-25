import { useRef, useState, type PointerEvent } from "react";
import type { EvidenceData, EvidencePin } from "@/lib/types";
import { BatButton } from "../bat-button";
import { nid } from "@/lib/utils";

const TONES: EvidencePin["tone"][] = ["red", "bone", "steel"];

const TONE_BORDER: Record<EvidencePin["tone"], string> = {
  red: "#b42323",
  bone: "#eceae4",
  steel: "#6e6b66",
};

export function EvidenceEditor({
  data,
  onChange,
}: {
  data: EvidenceData;
  onChange: (next: EvidenceData) => void;
}) {
  const [selected, setSelected] = useState<string | null>(data.pins[0]?.id ?? null);
  const [linkFrom, setLinkFrom] = useState<string | null>(null);
  const drag = useRef<{ id: string; ox: number; oy: number; nx: number; ny: number } | null>(
    null,
  );
  const pin = data.pins.find((p) => p.id === selected) ?? null;

  function addPin() {
    const next: EvidencePin = {
      id: nid(),
      x: 40 + (data.pins.length % 5) * 28,
      y: 40 + data.pins.length * 18,
      title: "Pin",
      body: "",
      tone: "red",
    };
    onChange({ ...data, pins: [...data.pins, next] });
    setSelected(next.id);
  }

  function patch(id: string, p: Partial<EvidencePin>) {
    onChange({
      ...data,
      pins: data.pins.map((n) => (n.id === id ? { ...n, ...p } : n)),
    });
  }

  function onDown(e: PointerEvent<HTMLButtonElement>, p: EvidencePin) {
    e.stopPropagation();
    setSelected(p.id);
    drag.current = { id: p.id, ox: e.clientX, oy: e.clientY, nx: p.x, ny: p.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    patch(drag.current.id, {
      x: Math.max(8, drag.current.nx + (e.clientX - drag.current.ox)),
      y: Math.max(8, drag.current.ny + (e.clientY - drag.current.oy)),
    });
  }

  function tryLink(id: string) {
    if (!linkFrom) {
      setLinkFrom(id);
      return;
    }
    if (linkFrom !== id) {
      const exists = data.strings.some(
        (s) =>
          (s.from === linkFrom && s.to === id) ||
          (s.from === id && s.to === linkFrom),
      );
      if (!exists) {
        onChange({
          ...data,
          strings: [...data.strings, { id: nid(), from: linkFrom, to: id }],
        });
      }
    }
    setLinkFrom(null);
  }

  const width = Math.max(720, ...data.pins.map((p) => p.x + 200));
  const height = Math.max(480, ...data.pins.map((p) => p.y + 160));

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          <BatButton label="Add pin" variant="inline" onClick={addPin} />
          <BatButton
            label={linkFrom ? "Stringing…" : "Red string"}
            variant="inline"
            active={!!linkFrom}
            onClick={() => setLinkFrom(linkFrom ? null : selected)}
          />
        </div>
        <div
          className="relative h-[min(62vh,560px)] overflow-auto rounded-[10px] border border-line"
          style={{
            background:
              "radial-gradient(circle at 20% 10%, #2a1a1a, #141210 42%, #0c0b0a)",
          }}
          onPointerMove={onMove}
          onPointerUp={() => {
            drag.current = null;
          }}
        >
          <div className="relative" style={{ width, height }}>
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {data.strings.map((s) => {
                const a = data.pins.find((p) => p.id === s.from);
                const b = data.pins.find((p) => p.id === s.to);
                if (!a || !b) return null;
                return (
                  <line
                    key={s.id}
                    x1={a.x + 80}
                    y1={a.y + 12}
                    x2={b.x + 80}
                    y2={b.y + 12}
                    stroke="#b42323"
                    strokeWidth="1.6"
                    opacity="0.85"
                  />
                );
              })}
            </svg>
            {data.pins.map((p) => (
              <button
                key={p.id}
                type="button"
                onPointerDown={(e) => onDown(e, p)}
                onClick={() => {
                  setSelected(p.id);
                  if (linkFrom) tryLink(p.id);
                }}
                className="absolute w-40 rounded-sm bg-surface/95 px-3 py-2 text-left shadow-[var(--shadow-cave)]"
                style={{
                  left: p.x,
                  top: p.y,
                  border: `1px solid ${TONE_BORDER[p.tone]}`,
                }}
              >
                <span
                  className="mb-2 block h-2 w-2 rounded-full"
                  style={{ background: TONE_BORDER[p.tone] }}
                />
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="mt-1 line-clamp-3 text-xs text-muted">{p.body}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <aside className="panel h-fit p-4">
        {pin ? (
          <div className="flex flex-col gap-3">
            <p className="label-kicker">Pin</p>
            <input
              value={pin.title}
              onChange={(e) => patch(pin.id, { title: e.target.value })}
              className="w-full bg-inset px-2 py-2 text-sm outline-none ring-1 ring-line focus:ring-accent"
            />
            <textarea
              value={pin.body}
              onChange={(e) => patch(pin.id, { body: e.target.value })}
              rows={5}
              className="w-full bg-inset px-2 py-2 text-sm outline-none ring-1 ring-line focus:ring-accent"
            />
            <div className="flex gap-2">
              {TONES.map((t) => (
                <BatButton
                  key={t}
                  label={t}
                  variant="inline"
                  active={pin.tone === t}
                  onClick={() => patch(pin.id, { tone: t })}
                />
              ))}
            </div>
            <BatButton
              label="Remove pin"
              variant="inline"
              onClick={() => {
                onChange({
                  kind: "evidence",
                  pins: data.pins.filter((p) => p.id !== pin.id),
                  strings: data.strings.filter(
                    (s) => s.from !== pin.id && s.to !== pin.id,
                  ),
                });
                setSelected(null);
              }}
            />
          </div>
        ) : (
          <p className="text-sm text-muted">Select a pin.</p>
        )}
      </aside>
    </div>
  );
}
