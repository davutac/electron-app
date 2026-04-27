import type { ElectronAPI } from "@electron-toolkit/preload";

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

declare global {
  interface Window {
    electron: ElectronAPI;
    api: AppApi;
  }
}
