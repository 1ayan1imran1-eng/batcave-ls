import type { RoadmapData, RoadmapEdge, RoadmapNode } from "./types";
import { nid } from "./utils";

export const BOARD_W = 1600;
export const BOARD_H = 760;
export const NODE_W = 176;
export const NODE_H = 78;

const START_POS = { x: 48, y: BOARD_H / 2 - NODE_H / 2 };
const END_POS = { x: BOARD_W - NODE_W - 48, y: BOARD_H / 2 - NODE_H / 2 };

export function emptyRoadmap(): RoadmapData {
  const startId = nid();
  const endId = nid();
  return {
    kind: "roadmap",
    nodes: [
      {
        id: startId,
        x: START_POS.x,
        y: START_POS.y,
        title: "START",
        detail: "Where the mission begins.",
        status: "done",
        role: "start",
      },
      {
        id: endId,
        x: END_POS.x,
        y: END_POS.y,
        title: "END",
        detail: "Where the mission ends.",
        status: "pending",
        role: "end",
      },
    ],
    edges: [{ id: nid(), from: startId, to: endId }],
  };
}

export function ensureRoadmap(data: RoadmapData): RoadmapData {
  const nodes: RoadmapNode[] = data.nodes.map((n) => ({
    ...n,
    role: n.role ?? "step",
  }));
  let start = nodes.find((n) => n.role === "start");
  let end = nodes.find((n) => n.role === "end");
  const edges: RoadmapEdge[] = [...data.edges];

  if (!start) {
    start = {
      id: nid(),
      x: START_POS.x,
      y: START_POS.y,
      title: "START",
      detail: "Where the mission begins.",
      status: "done",
      role: "start",
    };
    nodes.unshift(start);
  }
  if (!end) {
    end = {
      id: nid(),
      x: END_POS.x,
      y: END_POS.y,
      title: "END",
      detail: "Where the mission ends.",
      status: "pending",
      role: "end",
    };
    nodes.push(end);
  }

  const startId = start.id;
  const endId = end.id;
  const hasPath = pathExists(nodes, edges, startId, endId);
  if (!hasPath) {
    const steps = nodes.filter((n) => n.role === "step");
    if (!steps.length) {
      edges.push({ id: nid(), from: startId, to: endId });
    } else {
      const ordered = [...steps].sort((a, b) => a.x - b.x);
      edges.push({ id: nid(), from: startId, to: ordered[0].id });
      for (let i = 0; i < ordered.length - 1; i++) {
        edges.push({ id: nid(), from: ordered[i].id, to: ordered[i + 1].id });
      }
      edges.push({ id: nid(), from: ordered[ordered.length - 1].id, to: endId });
    }
  }

  return { kind: "roadmap", nodes, edges: dedupeEdges(edges) };
}

export function insertStep(data: RoadmapData): RoadmapData {
  const ensured = ensureRoadmap(data);
  const start = ensured.nodes.find((n) => n.role === "start")!;
  const end = ensured.nodes.find((n) => n.role === "end")!;
  const steps = ensured.nodes.filter((n) => n.role === "step");
  const col = steps.length;
  const lane = steps.length % 3;
  const node: RoadmapNode = {
    id: nid(),
    x: Math.min(END_POS.x - 220, 280 + col * 210),
    y: 110 + lane * 190,
    title: `Step ${steps.length + 1}`,
    detail: "",
    status: "pending",
    role: "step",
  };

  const intoEnd = ensured.edges.find((e) => e.to === end.id);
  let edges = ensured.edges;
  if (intoEnd) {
    edges = edges.filter((e) => e.id !== intoEnd.id);
    edges.push({ id: nid(), from: intoEnd.from, to: node.id });
    edges.push({ id: nid(), from: node.id, to: end.id });
  } else {
    edges = [
      ...edges,
      { id: nid(), from: start.id, to: node.id },
      { id: nid(), from: node.id, to: end.id },
    ];
  }

  return {
    kind: "roadmap",
    nodes: [...ensured.nodes, node],
    edges: dedupeEdges(edges),
  };
}

export function nodeCenter(n: RoadmapNode) {
  return { x: n.x + NODE_W / 2, y: n.y + NODE_H / 2 };
}

function neighbors(edges: RoadmapEdge[], id: string) {
  const out: string[] = [];
  for (const e of edges) {
    if (e.from === id) out.push(e.to);
    if (e.to === id) out.push(e.from);
  }
  return out;
}

function pathExists(
  _nodes: RoadmapNode[],
  edges: RoadmapEdge[],
  from: string,
  to: string,
) {
  const seen = new Set<string>([from]);
  const q = [from];
  while (q.length) {
    const cur = q.shift()!;
    if (cur === to) return true;
    for (const n of neighbors(edges, cur)) {
      if (!seen.has(n)) {
        seen.add(n);
        q.push(n);
      }
    }
  }
  return false;
}

function dedupeEdges(edges: RoadmapEdge[]) {
  const seen = new Set<string>();
  const out: RoadmapEdge[] = [];
  for (const e of edges) {
    if (e.from === e.to) continue;
    const key = [e.from, e.to].sort().join("::");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}
