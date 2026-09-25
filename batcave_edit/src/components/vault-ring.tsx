import { Link } from "@tanstack/react-router";
import { BatEmblem } from "./bat-emblem";
import type { Project } from "@/lib/types";
import { TYPE_META } from "@/lib/types";
import { cn, formatStamp } from "@/lib/utils";

export function ProjectCard({
  project,
  onDestroy,
  className,
}: {
  project: Project;
  onDestroy?: () => void;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "panel relative flex min-h-64 flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-cave)]",
        className,
      )}
    >
      <Link
        to="/vault/$id"
        params={{ id: project.id }}
        aria-label={`Open ${project.name}`}
        className="flex min-h-64 flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="flex items-start justify-between border-b border-line p-4 pr-28">
          <div>
            <p className="label-kicker text-accent">
              {TYPE_META[project.type].label}
            </p>
            <h3 className="mt-2 text-xl text-fg">{project.name}</h3>
          </div>
          <BatEmblem className="mt-1 h-4 w-8 fill-muted" />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="line-clamp-3 text-sm leading-6 text-muted">
            {project.tagline || "No briefing added yet."}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <div>
              <p className="label-kicker">Last updated</p>
              <p className="mt-1 text-xs tabular text-muted">
                {formatStamp(project.updatedAt)}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-sm border border-line bg-raised px-3 py-2 text-xs font-semibold tracking-[0.18em] text-fg uppercase">
              Open
            </span>
          </div>
        </div>
      </Link>

      {onDestroy ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDestroy();
          }}
          className="absolute top-3 right-3 z-10 inline-flex h-11 items-center rounded-sm border border-line bg-raised px-3 text-[0.62rem] font-semibold tracking-[0.16em] text-muted uppercase hover:border-accent hover:text-accent-hot"
        >
          Destroy
        </button>
      ) : null}
    </article>
  );
}
