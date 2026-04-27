import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const UPDATE_STATUS_CHANNEL = "updates:status";
const UPDATE_GET_STATUS_CHANNEL = "updates:get-status";
const UPDATE_INSTALL_CHANNEL = "updates:install";

type UpdateStatus =
  | { state: "idle" }
  | { state: "downloading"; percent: number; version: string }
  | { state: "ready"; version: string };

interface UpdateApi {
  getStatus: () => Promise<UpdateStatus>;
  install: () => Promise<void>;
  onStatusChange: (listener: (status: UpdateStatus) => void) => () => void;
}

interface AppApi {
  updates: UpdateApi;
}

// Custom APIs for renderer
const api: AppApi = {
  updates: {
    getStatus: () => ipcRenderer.invoke(UPDATE_GET_STATUS_CHANNEL) as Promise<UpdateStatus>,
    install: () => ipcRenderer.invoke(UPDATE_INSTALL_CHANNEL) as Promise<void>,
    onStatusChange: (listener) => {
      const subscription = (_event: Electron.IpcRendererEvent, status: UpdateStatus): void => {
        listener(status);
      };

      ipcRenderer.on(UPDATE_STATUS_CHANNEL, subscription);

      return () => {
        ipcRenderer.removeListener(UPDATE_STATUS_CHANNEL, subscription);
      };
    },
  },
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
