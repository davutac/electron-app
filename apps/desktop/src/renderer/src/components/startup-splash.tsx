import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CircleAlertIcon } from "lucide-react";

interface StartupSplashProps {
  hasError: boolean;
  onRetry: () => void;
}

const getStatusLabel = (hasError: boolean): string => {
  if (hasError) {
    return "Startup failed";
  }

  return "Starting";
};

const getStatusDescription = (hasError: boolean): string => {
  if (hasError) {
    return "The app could not finish starting. Try again in a moment.";
  }

  return "Getting things ready";
};

const StartupSplash = ({ hasError, onRetry }: StartupSplashProps) => (
  <main className="flex h-svh items-center justify-center bg-background px-6 text-foreground">
    <section className="flex w-full max-w-80 flex-col items-center gap-5 text-center">
      <div className="flex size-11 items-center justify-center rounded-md border border-border bg-secondary/60 text-muted-foreground shadow-sm">
        {hasError ? (
          <CircleAlertIcon aria-hidden="true" className="size-5" />
        ) : (
          <Spinner className="size-5" />
        )}
      </div>
      <div aria-live="polite" className="space-y-1.5" role="status">
        <h1 className="font-medium text-sm">{getStatusLabel(hasError)}</h1>
        <p className="text-muted-foreground text-xs/5">{getStatusDescription(hasError)}</p>
      </div>
      {hasError ? (
        <Button onClick={onRetry} size="sm" variant="outline">
          Retry
        </Button>
      ) : null}
    </section>
  </main>
);

export default StartupSplash;
