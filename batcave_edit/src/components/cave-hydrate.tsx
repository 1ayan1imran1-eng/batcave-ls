import { useEffect, type ReactNode } from "react";
import { useCaveStore } from "@/lib/cave-store";

export function CaveHydrate({ children }: { children: ReactNode }) {
  useEffect(() => {
    let live = true;
    const done = () => {
      if (!live) return;
      const s = useCaveStore.getState();
      if (!s.hydrated) s.setHydrated();
      s.restoreSession();
    };
    const result = useCaveStore.persist.rehydrate();
    if (result && typeof result.then === "function") {
      void result.then(done, done);
    } else {
      done();
    }
    return () => {
      live = false;
    };
  }, []);
  return children;
}
