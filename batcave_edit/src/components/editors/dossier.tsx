import type { DossierData } from "@/lib/types";
import { BatButton } from "../bat-button";
import { nid } from "@/lib/utils";

export function DossierEditor({
  data,
  onChange,
}: {
  data: DossierData;
  onChange: (next: DossierData) => void;
}) {
  function patchSection(id: string, patch: Partial<DossierData["sections"][number]>) {
    onChange({
      ...data,
      sections: data.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {data.sections.map((section) => (
        <article key={section.id} className="panel p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <input
              value={section.heading}
              onChange={(e) => patchSection(section.id, { heading: e.target.value })}
              className="type-display min-w-0 flex-1 bg-transparent text-xl text-fg outline-none"
              aria-label="Section heading"
            />
            <BatButton
              label="Remove section"
              variant="compact"
              onClick={() =>
                onChange({
                  ...data,
                  sections: data.sections.filter((s) => s.id !== section.id),
                })
              }
            />
          </div>
          <textarea
            value={section.body}
            onChange={(e) => patchSection(section.id, { body: e.target.value })}
            rows={8}
            className="w-full resize-y bg-inset p-3 text-sm leading-relaxed text-fg outline-none ring-1 ring-line focus:ring-accent"
            placeholder="Write the file. No filler."
          />
        </article>
      ))}
      <BatButton
        label="Add section"
        variant="inline"
        onClick={() =>
          onChange({
            ...data,
            sections: [
              ...data.sections,
              { id: nid(), heading: "New section", body: "" },
            ],
          })
        }
      />
    </div>
  );
}
