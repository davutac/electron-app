import { BrowserWindow } from "electron";

const TOAST_SHOW_CHANNEL = "toast:show";

export type RendererToastType = "default" | "error" | "info" | "success" | "warning";

export interface RendererToast {
  description?: string;
  duration?: number;
  id?: number | string;
  title: string;
  type?: RendererToastType;
}

export const sendToast = (toast: RendererToast, targetWindow?: BrowserWindow): void => {
  const targetWindows = targetWindow ? [targetWindow] : BrowserWindow.getAllWindows();

  for (const window of targetWindows) {
    if (!window.isDestroyed() && !window.webContents.isDestroyed()) {
      window.webContents.send(TOAST_SHOW_CHANNEL, toast);
    }
  }
};
