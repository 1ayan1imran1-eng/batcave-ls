export const PROJECT_TYPES = [
  "dossier",
  "roadmap",
  "evidence",
  "mission",
  "blueprint",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type Threat = "low" | "moderate" | "high" | "critical";
export type AllyStatus = "ally" | "neutral" | "watch";
export type NodeStatus = "pending" | "active" | "done";
export type MissionColumn = "planned" | "active" | "done";
export type RoadmapRole = "start" | "end" | "step";

export interface DossierSection {
  id: string;
  heading: string;
  body: string;
}

export interface DossierData {
  kind: "dossier";
  sections: DossierSection[];
}

export interface RoadmapNode {
  id: string;
  x: number;
  y: number;
  title: string;
  detail: string;
  status: NodeStatus;
  role: RoadmapRole;
}

export interface RoadmapEdge {
  id: string;
  from: string;
  to: string;
}

export interface RoadmapData {
  kind: "roadmap";
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

export interface EvidencePin {
  id: string;
  x: number;
  y: number;
  title: string;
  body: string;
  tone: "red" | "bone" | "steel";
}

export interface EvidenceString {
  id: string;
  from: string;
  to: string;
}

export interface EvidenceData {
  kind: "evidence";
  pins: EvidencePin[];
  strings: EvidenceString[];
}

export interface MissionItem {
  id: string;
  title: string;
  notes: string;
  column: MissionColumn;
}

export interface MissionData {
  kind: "mission";
  items: MissionItem[];
}

export interface Point {
  x: number;
  y: number;
}

export interface BlueprintStroke {
  id: string;
  points: Point[];
  color: "red" | "bone" | "steel";
  width: number;
}

export interface BlueprintData {
  kind: "blueprint";
  strokes: BlueprintStroke[];
}

export type ProjectData =
  | DossierData
  | RoadmapData
  | EvidenceData
  | MissionData
  | BlueprintData;

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  tagline: string;
  createdAt: number;
  updatedAt: number;
  data: ProjectData;
}

export interface JournalEntry {
  id: string;
  at: number;
  title: string;
  body: string;
  threat: Threat;
}

export interface IntelContact {
  id: string;
  name: string;
  role: string;
  notes: string;
  status: AllyStatus;
}

export interface YearNote {
  year: number;
  body: string;
}

export interface CaveSettings {
  operatorName: string;
  accessHash: string;
  rainAudio: boolean;
}

export interface CaveSnapshot {
  version: 1;
  settings: CaveSettings;
  projects: Project[];
  journal: JournalEntry[];
  intel: IntelContact[];
  yearNotes: YearNote[];
  highScore: number;
}

export const TYPE_META: Record<
  ProjectType,
  { label: string; blurb: string }
> = {
  dossier: {
    label: "Dossier",
    blurb: "Written files — sections, notes, and long-form intel.",
  },
  roadmap: {
    label: "Roadmap",
    blurb: "Start and end, connected by string. Drop steps in between.",
  },
  evidence: {
    label: "Evidence",
    blurb: "A pinboard. Drop notes and lace them with red string.",
  },
  mission: {
    label: "Mission",
    blurb: "Three columns. Move work from planned to done.",
  },
  blueprint: {
    label: "Blueprint",
    blurb: "Draw schematics by hand on a cave grid.",
  },
};
