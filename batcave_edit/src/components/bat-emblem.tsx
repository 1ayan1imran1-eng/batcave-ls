import { cn } from "@/lib/utils";

const PATH =
  "M256 32c-16 64-56 96-128 88-16 56-56 100-112 88 40-8 56-48 40-96C24 144 0 160 0 160c48 48 96 128 160 144 32 8 64-16 96 32 32-48 64-24 96-32 64-16 112-96 160-144 0 0-24-16-56-48-16 48 0 88 40 96-56 12-96-32-112-88-72 8-112-24-128-88z";

export function BatEmblem({
  className,
  title = "Bat emblem",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 512 304"
      width="56"
      height="33"
      className={cn("bat-wing", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATH} />
    </svg>
  );
}

export function BatEmblem3D({ className }: { className?: string }) {
  return (
    <div className={cn("relative preserve-3d", className)} aria-hidden>
      {Array.from({ length: 10 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 512 304"
          className="absolute inset-0 h-full w-full"
          width="512"
          height="304"
          style={{
            transform: `translateZ(${i * 2.2}px)`,
            fill: i === 9 ? "#e8e6e1" : i > 6 ? "#b42323" : "#1a0a0a",
            filter: i === 9 ? "drop-shadow(0 0 12px rgb(180 35 35 / 0.55))" : undefined,
          }}
        >
          <path d={PATH} />
        </svg>
      ))}
    </div>
  );
}
