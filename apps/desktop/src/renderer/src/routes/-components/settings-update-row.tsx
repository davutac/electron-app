import { DownloadIcon, LoaderCircleIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  SettingsRow,
  SettingsRowActions,
  SettingsRowContent,
  SettingsRowDescription,
  SettingsRowTitle,
} from "@/components/ui/settings";

type UpdateApi = Window["api"]["updates"];
type UpdateStatus = Awaited<ReturnType<UpdateApi["getStatus"]>>;

const SettingsUpdateRow = () => {
  const updateApi = window.api.updates;
  const [status, setStatus] = useState<UpdateStatus>({ state: "idle" });
  const [isManualCheckPending, setIsManualCheckPending] = useState(false);

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

  const handleCheckForUpdates = async (): Promise<void> => {
    setIsManualCheckPending(true);

    try {
      const nextStatus = await updateApi.check();
      setStatus(nextStatus);

      if (nextStatus.state === "idle") {
        toast.success("You're up to date", {
          description: "No update is available right now.",
        });
      }

      if (nextStatus.state === "downloading") {
        toast.info("Update found", {
          description: `Downloading version ${nextStatus.version}.`,
        });
      }

      if (nextStatus.state === "ready") {
        toast.success("Update ready", {
          description: `Version ${nextStatus.version} can be installed now.`,
        });
      }
    } catch {
      toast.error("Could not check for updates", {
        description: "Please try again later.",
      });
    } finally {
      setIsManualCheckPending(false);
    }
  };

  const handleInstallUpdate = (): void => {
    void updateApi.install();
  };

  const isChecking = status.state === "checking" || isManualCheckPending;
  const isDownloading = status.state === "downloading";
  const isReady = status.state === "ready";
  const isUnsupported = status.state === "unsupported";
  let checkButtonLabel = "Check for Updates";

  if (isChecking) {
    checkButtonLabel = "Checking";
  }

  if (isDownloading) {
    checkButtonLabel = "Downloading";
  }

  if (isUnsupported) {
    checkButtonLabel = "Unavailable";
  }

  return (
    <SettingsRow>
      <SettingsRowContent>
        <SettingsRowTitle id="updates-title">Updates</SettingsRowTitle>
        <SettingsRowDescription id="updates-description">
          Check whether a newer version is available
        </SettingsRowDescription>
      </SettingsRowContent>
      <SettingsRowActions>
        {isReady ? (
          <Button
            aria-describedby="updates-description"
            aria-labelledby="updates-title"
            onClick={handleInstallUpdate}
            type="button"
          >
            <DownloadIcon />
            <span>Install Update</span>
          </Button>
        ) : (
          <Button
            aria-describedby="updates-description"
            aria-labelledby="updates-title"
            disabled={isChecking || isDownloading || isUnsupported}
            onClick={() => {
              void handleCheckForUpdates();
            }}
            type="button"
            variant="outline"
          >
            {isChecking || isDownloading ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : (
              <RefreshCwIcon />
            )}
            <span>{checkButtonLabel}</span>
          </Button>
        )}
      </SettingsRowActions>
    </SettingsRow>
  );
};

export default SettingsUpdateRow;
