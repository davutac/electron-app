import { useEffect } from "react";
import { toast } from "sonner";

import { hasToastApi } from "@/lib/electron-runtime";

type ToastApi = Window["api"]["toasts"];
type ToastMessage = Parameters<Parameters<ToastApi["onShow"]>[0]>[0];

const showToast = ({ description, duration, id, title, type = "default" }: ToastMessage): void => {
  const options = { description, duration, id };

  switch (type) {
    case "error": {
      toast.error(title, options);
      return;
    }
    case "info": {
      toast.info(title, options);
      return;
    }
    case "success": {
      toast.success(title, options);
      return;
    }
    case "warning": {
      toast.warning(title, options);
      return;
    }
    case "default": {
      toast(title, options);
      return;
    }
    default: {
      const exhaustiveType: never = type;
      return exhaustiveType;
    }
  }
};

const IpcToastListener = () => {
  useEffect(() => {
    if (!hasToastApi()) {
      return;
    }

    return window.api.toasts.onShow(showToast);
  }, []);

  return null;
};

export default IpcToastListener;
