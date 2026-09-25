import { useRef, type PointerEvent, type ReactNode } from "react";
import { BatEmblem, BatEmblem3D } from "./bat-emblem";
import { cn } from "@/lib/utils";

export function ParallaxStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 16}deg`);
    el.style.setProperty("--rx", `${-8 + y * -10}deg`);
  }

  return (
    <div
      className={cn("scene-3d h-full w-full", className)}
      onPointerMove={onMove}
    >
      <div
        ref={ref}
        className="preserve-3d relative h-full w-full"
        style={{
          transform:
            "rotateX(var(--rx, -12deg)) rotateY(var(--ry, -14deg))",
          transition: "transform 180ms var(--ease-out)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function CaveDiorama({ signalOn }: { signalOn: boolean }) {
  return (
    <ParallaxStage className="min-h-[280px] sm:min-h-[420px]">
      <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-black">
        <img src="/cave-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(180,35,35,.16),transparent_42%),linear-gradient(to_bottom,rgba(0,0,0,.12),rgba(0,0,0,.82))]" />
      </div>
      <div className="preserve-3d absolute inset-0">
        <div className="absolute inset-x-[7%] bottom-[8%] h-[40%] rounded-[50%] border border-line bg-black/75" style={{ transform: "rotateX(78deg) translateZ(-48px)" }} />
        <div className="absolute left-[14%] bottom-[19%] h-28 w-72 rounded-full border border-accent/20 bg-accent/5 blur-sm" style={{ transform: "rotateX(78deg) translateZ(-8px)" }} />
        <CavePillars />
        <BatComputer />
        <Batmobile />
        <HangingBatarang />
        {signalOn ? <BatSignalBeam /> : null}
      </div>
    </ParallaxStage>
  );
}

function CavePillars() {
  return (
    <>
      {[8, 28, 72, 92].map((left, i) => (
        <div key={left} className="absolute bottom-[28%] h-[34%] w-3 rounded-full bg-zinc-950/90 border border-line" style={{ left: `${left}%`, transform: `translateZ(${10 + i * 8}px) rotateZ(${i % 2 ? 3 : -3}deg)` }} />
      ))}
      <div className="absolute left-[38%] top-[14%] h-1 w-24 bg-bone/10 blur-sm" style={{ transform: "translateZ(70px)" }} />
    </>
  );
}

function BatComputer() {
  return (
    <div className="preserve-3d absolute bottom-[22%] left-[13%] h-36 w-64" style={{ transform: "translateZ(38px) rotateY(6deg)" }}>
      <div className="absolute bottom-0 left-2 right-2 h-5 rounded-sm border border-line-strong bg-raised" />
      {[-32, 0, 32].map((rot, i) => (
        <div key={i} className="preserve-3d absolute bottom-5 h-24 w-20 rounded-sm border border-line bg-inset shadow-[0_12px_30px_rgb(0_0_0_/.35)]" style={{ left: `${24 + i * 52}px`, transform: `rotateY(${rot}deg) translateZ(18px)` }}>
          <div className="absolute inset-1 bg-accent/10" />
          <div className="absolute inset-2 opacity-80" style={{ background: "repeating-linear-gradient(to bottom, rgb(180 35 35 / 0.38) 0 2px, transparent 2px 7px)", animation: "flicker 3.8s steps(2) infinite", animationDelay: `${i * 0.4}s` }} />
          <div className="absolute inset-x-3 top-3 h-1 bg-bone/50" /><div className="absolute inset-x-4 top-7 h-1 bg-bone/25" /><div className="absolute inset-x-5 top-11 h-1 bg-accent/70" />
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-accent/30 ember-glow" />
    </div>
  );
}

function Batmobile() {
  return (
    <div className="preserve-3d absolute bottom-[18%] right-[10%] h-32 w-72" style={{ transform: "translateZ(70px) rotateY(-16deg) rotateX(4deg)" }}>
      <div className="absolute bottom-8 left-5 right-5 h-10 rounded-[45%_55%_22%_22%] border border-line-strong bg-zinc-950 shadow-[0_22px_35px_rgb(0_0_0_/.55)]" />
      <div className="absolute bottom-16 left-16 h-14 w-32 rounded-[60%_60%_15%_15%] border border-line bg-zinc-950" style={{ clipPath: "polygon(12% 100%, 28% 0, 72% 0, 100% 100%)" }} />
      <div className="absolute bottom-[74px] left-[104px] h-7 w-14 rounded-t-full bg-accent/15 border border-accent/30" />
      <div className="absolute bottom-12 left-2 h-4 w-16 bg-zinc-950 border border-line" />
      <div className="absolute bottom-12 right-2 h-4 w-16 bg-zinc-950 border border-line" />
      <div className="absolute bottom-6 left-8 h-3 w-9 rounded-full bg-accent/80 ember-glow" />
      <div className="absolute bottom-6 right-8 h-3 w-9 rounded-full bg-accent/80 ember-glow" />
      {[20, 236].map((left) => <div key={left} className="absolute bottom-0 h-9 w-9 rounded-full border-2 border-line-strong bg-black" style={{ left: `${left}px` }}><div className="absolute inset-2 rounded-full border border-accent/35" /></div>)}
      <div className="absolute left-[116px] bottom-[73px] h-8 w-2 bg-black border border-line origin-bottom -rotate-12" />
      <div className="absolute left-[134px] bottom-[73px] h-6 w-1.5 bg-black border border-line origin-bottom -rotate-6" />
    </div>
  );
}


function HangingBatarang() {
  return (
    <div
      className="absolute left-[10%] top-[22%] h-8 w-12 text-accent"
      style={{
        transform: "translateZ(56px) rotateZ(-18deg)",
        animation: "bat-float 5.5s var(--ease-smooth) infinite",
      }}
    >
      <div className="absolute left-1/2 top-[-22px] h-6 w-px bg-line" />
      <BatEmblem className="h-8 w-12 fill-current" />
    </div>
  );
}

export function BatSignalBeam() {
  return (
    <div className="pointer-events-none absolute inset-0 preserve-3d" aria-hidden>
      <div
        className="absolute left-1/2 top-[-6%] h-[58%] w-24 -translate-x-1/2 origin-bottom"
        style={{
          background:
            "linear-gradient(to top, rgb(232 230 225 / 0.16), rgb(232 230 225 / 0.02))",
          clipPath: "polygon(38% 100%, 0 0, 100% 0, 62% 100%)",
          animation: "signal-sweep 6s var(--ease-smooth) infinite",
          transform: "translateZ(16px)",
        }}
      />
    </div>
  );
}

export function OrbitingBats({ count = 8 }: { count?: number }) {
  return (
    <div className="scene-3d relative mx-auto h-56 w-56 sm:h-72 sm:w-72">
      <div
        className="preserve-3d absolute inset-0"
        style={{ animation: "spin-y 22s linear infinite" }}
      >
        {Array.from({ length: count }, (_, i) => {
          const angle = (360 / count) * i;
          return (
            <div
              key={i}
              className="preserve-3d absolute left-1/2 top-1/2 h-10 w-16 -ml-8 -mt-5"
              style={{
                transform: `rotateY(${angle}deg) translateZ(118px)`,
              }}
            >
              <BatEmblem className="h-full w-full fill-accent" />
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <BatEmblem3D className="h-16 w-28" />
      </div>
    </div>
  );
}

export function Skyline() {
  const widths = [18, 12, 22, 10, 16, 14, 20, 11, 15, 9, 17];
  const heights = [40, 70, 55, 90, 48, 78, 62, 84, 44, 66, 52];
  return (
    <div className="relative h-36 w-full overflow-hidden" aria-hidden>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 px-4">
        {widths.map((w, i) => (
          <div
            key={i}
            className="bg-raised border border-line"
            style={{ width: w, height: `${heights[i]}%` }}
          >
            <div className="mt-2 grid grid-cols-2 gap-px p-1 opacity-50">
              {Array.from({ length: 8 }, (_, k) => (
                <div
                  key={k}
                  className={k % 3 === 0 ? "h-1 bg-accent/50" : "h-1 bg-bone/15"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
