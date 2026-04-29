import { ipcRenderer } from "electron";
import type { SerializedResult } from "better-result";

const APP_START_CHANNEL = "app:start";

export type AppStartupResult = SerializedResult<void, unknown>;

export interface AppStartupApi {
  start: () => Promise<AppStartupResult>;
}

export const appStartupApi: AppStartupApi = {
  start: () => ipcRenderer.invoke(APP_START_CHANNEL),
};
