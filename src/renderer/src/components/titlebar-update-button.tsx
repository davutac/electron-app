import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type UpdateStatus = Awaited<ReturnType<typeof window.api.updates.getStatus>>;

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

const clampProgress = (percent: number): number =>
  Math.min(MAX_PROGRESS, Math.max(MIN_PROGRESS, percent));

const TitlebarUpdateButton = (): React.JSX.Element | null => {
  const [status, setStatus] = useState<UpdateStatus>({ state: "idle" });

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async (): Promise<void> => {
      const currentStatus = await window.api.updates.getStatus();

      if (isMounted) {
        setStatus(currentStatus);
      }
    };

    void loadStatus();

    const unsubscribe = window.api.updates.onStatusChange((nextStatus) => {
      setStatus(nextStatus);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (status.state === "idle") {
    return null;
  }

  if (status.state === "downloading") {
    const percent = clampProgress(status.percent);

    return (
      <Button
        aria-live="polite"
        className="app-titlebar-interactive"
        disabled
        size="icon-sm"
        type="button"
        variant="secondary"
      >
        <LoaderCircleIcon className="animate-spin" />
        <span className="sr-only">Downloading {percent}%</span>
      </Button>
    );
  }

  return (
    <Button
      className="app-titlebar-interactive"
      onClick={() => {
        void window.api.updates.install();
      }}
      size="sm"
      type="button"
      variant="secondary"
    >
      <DownloadIcon />
      <span>Update</span>
    </Button>
  );
};

export default TitlebarUpdateButton;
