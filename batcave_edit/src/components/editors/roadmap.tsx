import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { NodeStatus, RoadmapData, RoadmapNode } from "@/lib/types";
import {
  BOARD_H,
  BOARD_W,
  NODE_H,
  NODE_W,
  ensureRoadmap,
  insertStep,
  nodeCenter,
} from "@/lib/roadmap";
import { BatButton } from "../bat-button";
import { nid } from "@/lib/utils";

const STATUS: NodeStatus[] = ["pending", "active", "done"];

export function RoadmapEditor({
  data,
  onChange,
}: {
  data: RoadmapData;
  onChange: (next: RoadmapData) => void;
}) {
  const board = useRef<HTMLDivElement>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const drag = useRef<{
    id: string;
    ox: number;
    oy: number;
    nx: number;
    ny: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    const needsStart = !data.nodes.some((n) => n.role === "start");
    const needsEnd = !data.nodes.some((n) => n.role === "end");
    if (needsStart || needsEnd) onChange(ensureRoadmap(data));
  }, [data, onChange]);

  const map = ensureRoadmap(data);
  const selectedNode = map.nodes.find((n) => n.id === selected) ?? null;

  function patchNode(id: string, patch: Partial<RoadmapNode>) {
    onChange({
      ...map,
      nodes: map.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    });
  }

  function onNodeDown(e: PointerEvent<HTMLButtonElement>, node: RoadmapNode) {
    e.stopPropagation();
    setSelected(node.id);
    drag.current = {
      id: node.id,
      ox: e.clientX,
      oy: e.clientY,
      nx: node.x,
      ny: node.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onBoardMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.ox;
    const dy = e.clientY - drag.current.oy;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    patchNode(drag.current.id, {
      x: Math.max(16, Math.min(BOARD_W - NODE_W - 16, drag.current.nx + dx)),
      y: Math.max(16, Math.min(BOARD_H - NODE_H - 16, drag.current.ny + dy)),
    });
  }

  function endPointer() {
    drag.current = null;
  }

  function toggleConnect(id: string) {
    if (!connectFrom) {
      setConnectFrom(id);
      return;
    }
    if (connectFrom === id) {
      setConnectFrom(null);
      return;
    }
    const exists = map.edges.some(
      (ed) =>
        (ed.from === connectFrom && ed.to === id) ||
        (ed.from === id && ed.to === connectFrom),
    );
    if (!exists) {
      onChange({
        ...map,
        edges: [...map.edges, { id: nid(), from: connectFrom, to: id }],
      });
    }
    setConnectFrom(null);
  }

  function onNodeClick(node: RoadmapNode) {
    if (drag.current?.moved) return;
    setSelected(node.id);
    if (connectFrom) toggleConnect(node.id);
  }

  function add() {
    const next = insertStep(map);
    const created = next.nodes.find(
      (n) => !map.nodes.some((old) => old.id === n.id),
    );
    onChange(next);
    if (created) setSelected(created.id);
  }

  function removeEdge(id: string) {
    onChange({ ...map, edges: map.edges.filter((e) => e.id !== id) });
  }

  return (
    <div className="space-y-4">
      <div className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label-kicker">Mission route</p>
            <h2 className="mt-1 text-xl">Start → steps → end</h2>
            <p className="mt-1 text-sm text-muted">
              START and END stay on the board. Add steps between them, drag to
              place, then string them together.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <BatButton label="Add step" variant="inline" onClick={add} />
            <BatButton
              label={connectFrom ? "Tap a node…" : "Connect string"}
              variant="inline"
              active={!!connectFrom}
              onClick={() =>
                setConnectFrom(connectFrom ? null : (selected ?? null))
              }
            />
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-line bg-inset">
        <div
          ref={board}
          className="h-[min(72vh,680px)] touch-none overflow-auto"
          onPointerMove={onBoardMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
        >
          <div className="relative" style={{ width: BOARD_W, height: BOARD_H }}>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <marker
                  id="roadmap-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent)" />
                </marker>
              </defs>
              {map.edges.map((edge) => {
                const a = map.nodes.find((n) => n.id === edge.from);
                const b = map.nodes.find((n) => n.id === edge.to);
                if (!a || !b) return null;
                const p = nodeCenter(a);
                const q = nodeCenter(b);
                const mx = (p.x + q.x) / 2;
                return (
                  <g key={edge.id}>
                    <path
                      d={`M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="18"
                      className="cursor-pointer"
                      onClick={() => removeEdge(edge.id)}
                    />
                    <path
                      d={`M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${q.y}, ${q.x} ${q.y}`}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="2.5"
                      markerEnd="url(#roadmap-arrow)"
                      opacity="0.9"
                      className="pointer-events-none"
                    />
                  </g>
                );
              })}
            </svg>

            {map.nodes.map((node) => {
              const isAnchor = node.role !== "step";
              const on = selected === node.id || connectFrom === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onPointerDown={(e) => onNodeDown(e, node)}
                  onClick={() => onNodeClick(node)}
                  className="absolute rounded-sm border px-3 py-2 text-left"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: NODE_W,
                    height: NODE_H,
                    borderColor: on
                      ? "var(--color-accent-hot)"
                      : isAnchor
                        ? "var(--color-accent)"
                        : "var(--color-line)",
                    background: isAnchor
                      ? "color-mix(in oklab, var(--color-accent-dim) 55%, black)"
                      : "var(--color-surface)",
                    boxShadow: on ? "var(--shadow-ember)" : undefined,
                  }}
                >
                  <p className="label-kicker mb-1">
                    {node.role === "start"
                      ? "Start"
                      : node.role === "end"
                        ? "End"
                        : node.status}
                  </p>
                  <p className="truncate text-sm font-medium text-fg">
                    {node.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="panel p-4">
          <p className="label-kicker">How it works</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="bg-inset p-3">
              <b className="text-sm">01 · Add</b>
              <p className="mt-1 text-xs text-muted">
                Drop a step on the string between start and end.
              </p>
            </div>
            <div className="bg-inset p-3">
              <b className="text-sm">02 · Connect</b>
              <p className="mt-1 text-xs text-muted">
                Hit Connect string, then tap two nodes. Tap a string to cut it.
              </p>
            </div>
            <div className="bg-inset p-3">
              <b className="text-sm">03 · Track</b>
              <p className="mt-1 text-xs text-muted">
                Mark each step pending, active, or done.
              </p>
            </div>
          </div>
        </div>
        <aside className="panel h-fit p-4">
          {selectedNode ? (
            <div className="flex flex-col gap-3">
              <p className="label-kicker">
                {selectedNode.role === "step" ? "Selected step" : selectedNode.role}
              </p>
              <input
                value={selectedNode.title}
                onChange={(e) =>
                  patchNode(selectedNode.id, { title: e.target.value })
                }
                className="w-full bg-inset px-2 py-2 text-sm text-fg outline-none ring-1 ring-line focus:ring-accent"
              />
              <textarea
                value={selectedNode.detail}
                onChange={(e) =>
                  patchNode(selectedNode.id, { detail: e.target.value })
                }
                rows={5}
                className="w-full bg-inset px-2 py-2 text-sm text-fg outline-none ring-1 ring-line focus:ring-accent"
                placeholder="What this step actually is."
              />
              {selectedNode.role === "step" ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {STATUS.map((st) => (
                      <BatButton
                        key={st}
                        label={st}
                        variant="inline"
                        active={selectedNode.status === st}
                        onClick={() =>
                          patchNode(selectedNode.id, { status: st })
                        }
                      />
                    ))}
                  </div>
                  <BatButton
                    label="Delete step"
                    variant="inline"
                    onClick={() => {
                      onChange({
                        kind: "roadmap",
                        nodes: map.nodes.filter((n) => n.id !== selectedNode.id),
                        edges: map.edges.filter(
                          (e) =>
                            e.from !== selectedNode.id &&
                            e.to !== selectedNode.id,
                        ),
                      });
                      setSelected(null);
                    }}
                  />
                </>
              ) : (
                <p className="text-xs text-muted">
                  Anchors stay on the board. Rename them, but you cannot delete
                  START or END.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Add or select a step to edit it.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
