import { createFileRoute } from "@tanstack/react-router";

const DashboardRoute = () => (
  <section aria-labelledby="dashboard-title" className="flex min-h-full flex-col gap-6 p-6">
    <div className="flex flex-col gap-2">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Dashboard</p>
      <h1 id="dashboard-title" className="font-semibold text-2xl tracking-tight">
        Welcome back
      </h1>
      <p className="max-w-2xl text-muted-foreground text-sm">
        This is the main workspace for your Electron app.
      </p>
    </div>
  </section>
);

export const Route = createFileRoute("/")({
  component: DashboardRoute,
});
