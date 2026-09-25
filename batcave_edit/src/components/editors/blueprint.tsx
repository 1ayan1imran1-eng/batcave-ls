import { useRef, useState, type PointerEvent } from "react";
import type { BlueprintData, BlueprintStroke, Point } from "@/lib/types";
import { BatButton } from "../bat-button";
import { nid } from "@/lib/utils";

const COLORS: { id: BlueprintStroke["color"]; token: string }[] = [
  { id: "red", token: "var(--color-accent)" },
  { id: "bone", token: "var(--color-bone)" },
  { id: "steel", token: "var(--color-muted)" },
];

function pathD(points: Point[]) {
  if (!points.length) return "";
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}

export function BlueprintEditor({
  data,
  onChange,
}: {
  data: BlueprintData;
  onChange: (next: BlueprintData) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const live = useRef<Point[]>([]);
  const drawing = useRef(false);
  const [preview, setPreview] = useState<Point[] | null>(null);
  const [color, setColor] = useState<BlueprintStroke["color"]>("red");
  const [width, setWidth] = useState(2.8);

  function pos(e: PointerEvent<SVGSVGElement>): Point {
    const box = svg.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - box.left) / box.width) * 1000,
      y: ((e.clientY - box.top) / box.height) * 620,
    };
  }

  function down(e: PointerEvent<SVGSVGElement>) {
    if (e.button !== undefined && e.button !== 0) return;
    drawing.current = true;
    live.current = [pos(e)];
    setPreview([...live.current]);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function move(e: PointerEvent<SVGSVGElement>) {
    if (!drawing.current) return;
    const next = pos(e);
    const last = live.current[live.current.length - 1];
    if (
      last &&
      Math.abs(last.x - next.x) < 0.8 &&
      Math.abs(last.y - next.y) < 0.8
    ) {
      return;
    }
    live.current.push(next);
    setPreview([...live.current]);
  }

  function up() {
    if (!drawing.current) return;
    drawing.current = false;
    const points = live.current;
    live.current = [];
    setPreview(null);
    if (points.length < 2) return;
    onChange({
      kind: "blueprint",
      strokes: [
        ...data.strokes,
        { id: nid(), points, color, width },
      ],
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {COLORS.map((c) => (
          <BatButton
            key={c.id}
            label={c.id}
            variant="inline"
            active={color === c.id}
            onClick={() => setColor(c.id)}
          />
        ))}
        <label className="ml-2 flex items-center gap-2 text-[0.65rem] tracking-[0.18em] text-muted uppercase">
          Weight
          <input
            type="range"
            min={1}
            max={10}
            step={0.4}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            aria-label="Stroke weight"
          />
        </label>
        <BatButton
          label="Undo"
          variant="inline"
          onClick={() =>
            onChange({ kind: "blueprint", strokes: data.strokes.slice(0, -1) })
          }
        />
        <BatButton
          label="Clear"
          variant="inline"
          onClick={() => onChange({ kind: "blueprint", strokes: [] })}
        />
      </div>
      <svg
        ref={svg}
        viewBox="0 0 1000 620"
        className="h-[min(62vh,560px)] w-full touch-none rounded-[10px] border border-line bg-inset"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1000" height="620" fill="url(#grid)" />
        {data.strokes.map((s) => (
          <path
            key={s.id}
            d={pathD(s.points)}
            fill="none"
            stroke={COLORS.find((c) => c.id === s.color)?.token}
            strokeWidth={s.width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {preview ? (
          <path
            d={pathD(preview)}
            fill="none"
            stroke={COLORS.find((c) => c.id === color)?.token}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
      <p className="text-xs text-muted">
        Draw on the grid. Use undo to take back the last stroke, or clear the
        whole sheet.
      </p>
    </div>
  );
}
