import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BatButton } from "@/components/bat-button";
import { ProjectCard } from "@/components/vault-ring";
import { useCaveStore } from "@/lib/cave-store";
import { PROJECT_TYPES, TYPE_META, type ProjectType } from "@/lib/types";

export const Route = createFileRoute("/_cave/vault/")({
  component: Vault,
});

function Vault() {
  const projects = useCaveStore((s) => s.projects);
  const addProject = useCaveStore((s) => s.addProject);
  const removeProject = useCaveStore((s) => s.removeProject);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [type, setType] = useState<ProjectType>("dossier");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectType | "all">("all");

  const visibleProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (filter === "all" || p.type === filter) &&
        (!q || `${p.name} ${p.tagline}`.toLowerCase().includes(q)),
    );
  }, [projects, query, filter]);

  function create() {
    const id = addProject({ name: name || "Untitled file", type, tagline });
    setOpen(false);
    setName("");
    setTagline("");
    void navigate({ to: "/vault/$id", params: { id } });
  }

  function destroy(id: string, label: string) {
    if (window.confirm(`Destroy “${label}”? This cannot be undone.`)) {
      removeProject(id);
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 sm:px-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-kicker">Project vault</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">The ring of files.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Open a card to edit it. Roadmaps have a start and an end, stitched
            with string. Blueprints are a drawing canvas. Destroy files you no
            longer need.
          </p>
        </div>
        <BatButton
          label="New file"
          variant="inline"
          onClick={() => setOpen(true)}
        />
      </header>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            aria-label="Search files"
            className="h-11 min-w-0 flex-1 bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ProjectType | "all")}
            aria-label="Filter by type"
            className="h-11 bg-inset px-3 text-sm text-fg outline-none ring-1 ring-line focus:ring-accent"
          >
            <option value="all">All types</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_META[t].label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {projects.length === 0 ? (
        <div className="panel mx-auto flex min-h-[280px] w-full flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-fg">The vault is empty.</p>
          <p className="text-sm text-muted">
            Create a file to start building.
          </p>
          <BatButton
            label="New file"
            variant="inline"
            onClick={() => setOpen(true)}
          />
        </div>
      ) : visibleProjects.length === 0 ? (
        <div className="panel flex min-h-[180px] items-center justify-center p-8 text-center text-sm text-muted">
          No project files match that search.
        </div>
      ) : (
        <section>
          <div className="mb-3">
            <p className="label-kicker">All files</p>
            <p className="mt-1 text-xs text-muted">
              {visibleProjects.length} visible · {projects.length} total
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onDestroy={() => destroy(p.id, p.name)}
              />
            ))}
          </div>
        </section>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-file-title"
        >
          <div className="panel w-full max-w-lg p-5 sm:p-6">
            <h2 id="new-file-title" className="text-2xl">
              New file
            </h2>
            <label className="mt-5 block">
              <span className="label-kicker">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-11 w-full bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
              />
            </label>
            <label className="mt-4 block">
              <span className="label-kicker">Briefing</span>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="mt-2 h-11 w-full bg-inset px-3 text-sm outline-none ring-1 ring-line focus:ring-accent"
              />
            </label>
            <p className="label-kicker mt-5 mb-2">Type</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PROJECT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="border border-line p-3 text-left transition-colors duration-150 hover:border-accent data-[on=true]:border-accent"
                  data-on={type === t}
                >
                  <p className="text-sm font-medium">{TYPE_META[t].label}</p>
                  <p className="mt-1 text-xs text-muted">{TYPE_META[t].blurb}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <BatButton label="Create" variant="inline" onClick={create} />
              <BatButton
                label="Cancel"
                variant="inline"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
