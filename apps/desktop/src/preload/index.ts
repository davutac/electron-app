import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import type { ToastApi } from "./toast-api";
import { toastApi } from "./toast-api";
import type { UpdateApi } from "./update-api";
import { updateApi } from "./update-api";

export interface AppApi {
  toasts: ToastApi;
  updates: UpdateApi;
}

const api: AppApi = {
  toasts: toastApi,
  updates: updateApi,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  Object.assign(window, { api, electron: electronAPI });
}
