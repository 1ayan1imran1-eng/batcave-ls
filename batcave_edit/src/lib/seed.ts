import { nid } from "./utils";
import type { IntelContact, JournalEntry, Project } from "./types";

const now = Date.now();

export function seedProjects(): Project[] {
  const start = nid();
  const a = nid();
  const b = nid();
  const c = nid();
  const d = nid();
  const e = nid();
  const end = nid();

  const p1: Project = {
    id: nid(),
    name: "The 18th Protocol",
    type: "roadmap",
    tagline: "Turning eighteen. Build the man, not just the myth.",
    createdAt: now - 86400000 * 12,
    updatedAt: now - 3600000,
    data: {
      kind: "roadmap",
      nodes: [
        {
          id: start,
          x: 48,
          y: 341,
          title: "START",
          detail: "Where the mission begins.",
          status: "done",
          role: "start",
        },
        {
          id: a,
          x: 280,
          y: 160,
          title: "Hold the line",
          detail: "Finish the year clean. Sleep. Train. Keep the cave in order.",
          status: "done",
          role: "step",
        },
        {
          id: b,
          x: 520,
          y: 90,
          title: "Skill stack",
          detail: "Code, design, and one physical craft. No half-skills.",
          status: "active",
          role: "step",
        },
        {
          id: c,
          x: 520,
          y: 280,
          title: "Body of work",
          detail: "Ship three things you can point at. This cave is one of them.",
          status: "active",
          role: "step",
        },
        {
          id: d,
          x: 780,
          y: 180,
          title: "Independence",
          detail: "Money, papers, a plan that does not ask permission.",
          status: "pending",
          role: "step",
        },
        {
          id: e,
          x: 1040,
          y: 180,
          title: "The night shift",
          detail: "Eighteen. The city does not get easier. You do.",
          status: "pending",
          role: "step",
        },
        {
          id: end,
          x: 1376,
          y: 341,
          title: "END",
          detail: "Where the mission ends.",
          status: "pending",
          role: "end",
        },
      ],
      edges: [
        { id: nid(), from: start, to: a },
        { id: nid(), from: a, to: b },
        { id: nid(), from: a, to: c },
        { id: nid(), from: b, to: d },
        { id: nid(), from: c, to: d },
        { id: nid(), from: d, to: e },
        { id: nid(), from: e, to: end },
      ],
    },
  };

  const p2: Project = {
    id: nid(),
    name: "Cave Operating System",
    type: "dossier",
    tagline: "How this place works when the lights are off.",
    createdAt: now - 86400000 * 6,
    updatedAt: now - 7200000,
    data: {
      kind: "dossier",
      sections: [
        {
          id: nid(),
          heading: "Purpose",
          body: "This is not a mood board. It is a working cave — projects, missions, evidence, and a clock that does not lie about how much time is left.",
        },
        {
          id: nid(),
          heading: "Vault types",
          body: "Dossier for writing. Roadmap for sequenced work (start, steps, end, connected by string). Evidence for messy thinking with red string. Mission for kanban. Blueprint for sketches.",
        },
        {
          id: nid(),
          heading: "Rules",
          body: "One thing in motion. Name it. Date it. Do not leave ghosts in the vault.",
        },
      ],
    },
  };

  const n1 = nid();
  const n2 = nid();
  const n3 = nid();

  const p3: Project = {
    id: nid(),
    name: "Open Cases",
    type: "evidence",
    tagline: "Threads that do not get to stay loose.",
    createdAt: now - 86400000 * 4,
    updatedAt: now - 5400000,
    data: {
      kind: "evidence",
      pins: [
        {
          id: n1,
          x: 48,
          y: 56,
          title: "Time",
          body: "Dec 2 is not abstract. Count it.",
          tone: "red",
        },
        {
          id: n2,
          x: 280,
          y: 40,
          title: "Craft",
          body: "The vault only matters if it fills with real work.",
          tone: "bone",
        },
        {
          id: n3,
          x: 160,
          y: 200,
          title: "Signal",
          body: "Who you become in private is who shows up in public.",
          tone: "steel",
        },
      ],
      strings: [
        { id: nid(), from: n1, to: n2 },
        { id: nid(), from: n2, to: n3 },
      ],
    },
  };

  const p4: Project = {
    id: nid(),
    name: "Night Operations",
    type: "mission",
    tagline: "What is on the board tonight.",
    createdAt: now - 86400000 * 2,
    updatedAt: now - 1800000,
    data: {
      kind: "mission",
      items: [
        {
          id: nid(),
          title: "Stand up the cave",
          notes: "Access code, vault, first dossier.",
          column: "done",
        },
        {
          id: nid(),
          title: "Map the 18th protocol",
          notes: "Connect the remaining steps.",
          column: "active",
        },
        {
          id: nid(),
          title: "Train in Shadow Strike",
          notes: "Beat the current high score.",
          column: "planned",
        },
      ],
    },
  };

  const p5: Project = {
    id: nid(),
    name: "Batmobile schematic",
    type: "blueprint",
    tagline: "Scratch the plan on the grid. Nothing is finished until it is drawn.",
    createdAt: now - 86400000,
    updatedAt: now - 900000,
    data: { kind: "blueprint", strokes: [] },
  };

  return [p1, p2, p3, p4, p5];
}

export function seedJournal(): JournalEntry[] {
  return [
    {
      id: nid(),
      at: now - 86400000,
      title: "Cave online",
      body: "Lights up. Rain on the stone. The vault is empty until I put work in it.",
      threat: "low",
    },
  ];
}

export function seedIntel(): IntelContact[] {
  return [
    {
      id: nid(),
      name: "Alfred",
      role: "Steward",
      notes: "The voice that tells the truth when the cave gets theatrical.",
      status: "ally",
    },
    {
      id: nid(),
      name: "Lucius",
      role: "Engine",
      notes: "If it can be built, he already drafted it.",
      status: "ally",
    },
  ];
}
