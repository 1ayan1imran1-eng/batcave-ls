import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { CaveNav } from "@/components/cave-nav";
import { BootScreen } from "@/components/boot-screen";
import { useCaveStore } from "@/lib/cave-store";

export const Route = createFileRoute("/_cave")({
  component: CaveShell,
});

function CaveShell() {
  const hydrated = useCaveStore((s) => s.hydrated);
  const unlocked = useCaveStore((s) => s.unlocked);
  const hasHash = useCaveStore((s) => Boolean(s.settings.accessHash));

  if (!hydrated) return <BootScreen />;
  if (!hasHash || !unlocked) return <Navigate to="/" />;

  return (
    <div className="cave-shell flex min-h-dvh lg:flex-row flex-col">
      <CaveNav />
      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <Outlet />
      </div>
    </div>
  );
}
