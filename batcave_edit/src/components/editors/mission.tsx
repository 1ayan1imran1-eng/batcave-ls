import type { MissionColumn, MissionData } from "@/lib/types";
import { BatButton } from "../bat-button";
import { nid } from "@/lib/utils";

const COLS: { id: MissionColumn; label: string }[] = [
  { id: "planned", label: "Planned" },
  { id: "active", label: "Active" },
  { id: "done", label: "Done" },
];

export function MissionEditor({
  data,
  onChange,
}: {
  data: MissionData;
  onChange: (next: MissionData) => void;
}) {
  function add() {
    onChange({
      kind: "mission",
      items: [
        {
          id: nid(),
          title: "New task",
          notes: "",
          column: "planned",
        },
        ...data.items,
      ],
    });
  }

  function patch(id: string, p: Partial<MissionData["items"][number]>) {
    onChange({
      kind: "mission",
      items: data.items.map((i) => (i.id === id ? { ...i, ...p } : i)),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <BatButton label="Add task" variant="inline" onClick={add} />
      <div className="grid gap-3 md:grid-cols-3">
        {COLS.map((col) => (
          <section key={col.id} className="panel min-h-[280px] p-3">
            <p className="label-kicker mb-3">{col.label}</p>
            <div className="flex flex-col gap-3">
              {data.items
                .filter((i) => i.column === col.id)
                .map((item) => (
                  <article key={item.id} className="border border-line bg-inset p-3">
                    <input
                      value={item.title}
                      onChange={(e) => patch(item.id, { title: e.target.value })}
                      className="w-full bg-transparent text-sm font-medium outline-none"
                    />
                    <textarea
                      value={item.notes}
                      onChange={(e) => patch(item.id, { notes: e.target.value })}
                      rows={3}
                      className="mt-2 w-full bg-transparent text-xs text-muted outline-none"
                      placeholder="Notes"
                    />
                    <div className="mt-2 flex flex-wrap gap-1">
                      {COLS.map((c) => (
                        <BatButton
                          key={c.id}
                          label={c.label}
                          variant="inline"
                          active={item.column === c.id}
                          className="px-2 py-1 text-[0.6rem]"
                          onClick={() => patch(item.id, { column: c.id })}
                        />
                      ))}
                      <BatButton
                        label="Remove"
                        variant="compact"
                        onClick={() =>
                          onChange({
                            kind: "mission",
                            items: data.items.filter((i) => i.id !== item.id),
                          })
                        }
                      />
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
