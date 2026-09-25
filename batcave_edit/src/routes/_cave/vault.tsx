import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_cave/vault")({
  component: VaultLayout,
});

function VaultLayout() {
  return <Outlet />;
}
