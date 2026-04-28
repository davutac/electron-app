import { ipcRenderer } from "electron";

const UPDATE_STATUS_CHANNEL = "updates:status";
const UPDATE_GET_STATUS_CHANNEL = "updates:get-status";
const UPDATE_INSTALL_CHANNEL = "updates:install";

type UpdateStatus =
  | { state: "idle" }
  | { state: "downloading"; percent: number; version: string }
  | { state: "ready"; version: string };

export interface UpdateApi {
  getStatus: () => Promise<UpdateStatus>;
  install: () => Promise<void>;
  onStatusChange: (listener: (status: UpdateStatus) => void) => () => void;
}

// Custom APIs for renderer
export const updateApi: UpdateApi = {
  getStatus: () => ipcRenderer.invoke(UPDATE_GET_STATUS_CHANNEL),
  install: () => ipcRenderer.invoke(UPDATE_INSTALL_CHANNEL),
  onStatusChange: (listener) => {
    const subscription = (_event: Electron.IpcRendererEvent, status: UpdateStatus): void => {
      listener(status);
    };

    ipcRenderer.on(UPDATE_STATUS_CHANNEL, subscription);

    return () => {
      ipcRenderer.removeListener(UPDATE_STATUS_CHANNEL, subscription);
    };
  },
};
