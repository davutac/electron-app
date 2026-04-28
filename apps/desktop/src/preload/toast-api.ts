import { ipcRenderer } from "electron";

const TOAST_SHOW_CHANNEL = "toast:show";

export type ToastType = "default" | "error" | "info" | "success" | "warning";

export interface ToastMessage {
  description?: string;
  duration?: number;
  id?: number | string;
  title: string;
  type?: ToastType;
}

export interface ToastApi {
  onShow: (listener: (message: ToastMessage) => void) => () => void;
}

export const toastApi: ToastApi = {
  onShow: (listener) => {
    const subscription = (_event: Electron.IpcRendererEvent, message: ToastMessage): void => {
      listener(message);
    };

    ipcRenderer.on(TOAST_SHOW_CHANNEL, subscription);

    return () => {
      ipcRenderer.removeListener(TOAST_SHOW_CHANNEL, subscription);
    };
  },
};
