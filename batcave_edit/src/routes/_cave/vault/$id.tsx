import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { BatButton } from "@/components/bat-button";
import { BlueprintEditor } from "@/components/editors/blueprint";
import { DossierEditor } from "@/components/editors/dossier";
import { EvidenceEditor } from "@/components/editors/evidence";
import { MissionEditor } from "@/components/editors/mission";
import { RoadmapEditor } from "@/components/editors/roadmap";
import { useCaveStore } from "@/lib/cave-store";
import { TYPE_META, type ProjectData } from "@/lib/types";
import { formatStamp } from "@/lib/utils";

export const Route = createFileRoute("/_cave/vault/$id")({
  component: ProjectFile,
});

function ProjectFile() {
  const { id } = Route.useParams();
  const project = useCaveStore((s) => s.projects.find((p) => p.id === id));
  const updateProject = useCaveStore((s) => s.updateProject);
  const setProjectData = useCaveStore((s) => s.setProjectData);
  const removeProject = useCaveStore((s) => s.removeProject);
  const hydrated = useCaveStore((s) => s.hydrated);
  const navigate = useNavigate();
  const [savedAt, setSavedAt] = useState(project?.updatedAt ?? Date.now());

  useEffect(() => {
    if (project?.updatedAt) setSavedAt(project.updatedAt);
  }, [project?.updatedAt]);

  const onData = useCallback(
    (data: ProjectData) => {
      setProjectData(id, data);
      setSavedAt(Date.now());
    },
    [id, setProjectData],
  );

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="label-kicker">Opening file</p>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-3xl">File missing</h1>
        <p className="mt-3 text-muted">This card is no longer in the vault.</p>
        <Link
          to="/vault"
          className="mt-6 inline-flex items-center gap-2 rounded-sm border border-line bg-raised px-3 py-2 text-xs font-semibold tracking-[0.18em] text-fg uppercase hover:border-accent"
        >
          Return
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link to="/vault" className="label-kicker text-muted hover:text-fg">
            Vault
          </Link>
          <input
            value={project.name}
            onChange={(e) => updateProject(id, { name: e.target.value })}
            className="mt-2 block w-full bg-transparent type-display text-3xl text-fg outline-none sm:text-4xl"
            aria-label="Project name"
          />
          <input
            value={project.tagline}
            onChange={(e) => updateProject(id, { tagline: e.target.value })}
            className="mt-2 block w-full bg-transparent text-sm text-muted outline-none"
            placeholder="Briefing"
            aria-label="Project briefing"
          />
          <p className="mt-2 text-[0.65rem] tracking-[0.18em] text-faint uppercase">
            {TYPE_META[project.type].label} · {formatStamp(project.updatedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-sm border border-line bg-inset px-2 py-1 text-[0.6rem] font-semibold tracking-[0.16em] text-muted uppercase">
            Saved {formatStamp(savedAt)}
          </span>
          <BatButton
            label="Destroy file"
            variant="inline"
            onClick={() => {
              if (window.confirm("Destroy this file?")) {
                removeProject(id);
                void navigate({ to: "/vault" });
              }
            }}
          />
        </div>
      </div>

      <div className="panel p-4">
        <p className="label-kicker">Project workspace</p>
        <p className="mt-2 text-sm text-muted">
          {TYPE_META[project.type].blurb} Everything below saves as you work.
        </p>
      </div>

      {project.data.kind === "dossier" ? (
        <DossierEditor data={project.data} onChange={onData} />
      ) : null}
      {project.data.kind === "roadmap" ? (
        <RoadmapEditor data={project.data} onChange={onData} />
      ) : null}
      {project.data.kind === "evidence" ? (
        <EvidenceEditor data={project.data} onChange={onData} />
      ) : null}
      {project.data.kind === "mission" ? (
        <MissionEditor data={project.data} onChange={onData} />
      ) : null}
      {project.data.kind === "blueprint" ? (
        <BlueprintEditor data={project.data} onChange={onData} />
      ) : null}
    </main>
  );
}
