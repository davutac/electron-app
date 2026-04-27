import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type UpdateApi = Window["api"]["updates"];
type UpdateStatus = Awaited<ReturnType<UpdateApi["getStatus"]>>;

const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;

const clampProgress = (percent: number): number =>
  Math.min(MAX_PROGRESS, Math.max(MIN_PROGRESS, percent));

const TitlebarUpdateButton = (): React.JSX.Element | null => {
  const updateApi = window.api.updates;
  const [status, setStatus] = useState<UpdateStatus>({ state: "idle" });

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async (): Promise<void> => {
      const currentStatus = await updateApi.getStatus();

      if (isMounted) {
        setStatus(currentStatus);
      }
    };

    void loadStatus();

    const unsubscribe = updateApi.onStatusChange((nextStatus) => {
      setStatus(nextStatus);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [updateApi]);

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
        void updateApi.install();
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
