import Versions from "@/components/versions";
import { createFileRoute } from "@tanstack/react-router";

const SettingsRoute = (): React.JSX.Element => (
  <section aria-labelledby="settings-title" className="flex min-h-full flex-col gap-6 p-6">
    <div className="flex flex-col gap-2">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Settings</p>
      <h1 id="settings-title" className="font-semibold text-2xl tracking-tight">
        Settings
      </h1>
      <p className="max-w-2xl text-muted-foreground text-sm">
        Manage application preferences and workspace defaults.
      </p>
    </div>

    <div className="max-w-2xl rounded-lg border bg-card p-4 text-card-foreground">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-sm">General</h2>
        <p className="text-muted-foreground text-sm">
          Settings controls can be added here as the app preferences take shape.
        </p>
      </div>
    </div>

    <Versions />
  </section>
);

export const Route = createFileRoute("/settings")({
  component: SettingsRoute,
});
