import { createFileRoute } from "@tanstack/react-router";
import { ShadowStrike } from "@/components/shadow-strike";

export const Route = createFileRoute("/_cave/training")({
  component: Training,
});

function Training() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-8 sm:py-10">
      <header>
        <p className="label-kicker">Training</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Shadow Strike.</h1>
      </header>
      <ShadowStrike />
    </main>
  );
}
