import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain } from "electron";
import * as ElectronUpdater from "electron-updater";

const UPDATE_CHECK_DELAY_MS = 3000;
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;
const UPDATE_STATUS_CHANNEL = "updates:status";
const UPDATE_GET_STATUS_CHANNEL = "updates:get-status";
const UPDATE_INSTALL_CHANNEL = "updates:install";

type UpdateStatus =
  | { state: "idle" }
  | { state: "downloading"; percent: number; version: string }
  | { state: "ready"; version: string };

let isInitialized = false;
let areIpcHandlersRegistered = false;
let isCheckingForUpdates = false;
let currentStatus: UpdateStatus = { state: "idle" };

const canSelfUpdate = (): boolean => {
  if (is.dev || !app.isPackaged) {
    return false;
  }

  if (process.platform === "linux") {
    return typeof process.env["APPIMAGE"] === "string";
  }

  return process.platform === "darwin" || process.platform === "win32";
};

const updateStatus = (status: UpdateStatus): void => {
  currentStatus = status;

  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send(UPDATE_STATUS_CHANNEL, status);
  }
};

const registerUpdaterIpc = (): void => {
  if (areIpcHandlersRegistered) {
    return;
  }

  areIpcHandlersRegistered = true;

  ipcMain.handle(UPDATE_GET_STATUS_CHANNEL, () => currentStatus);
  ipcMain.handle(UPDATE_INSTALL_CHANNEL, () => {
    if (currentStatus.state === "ready") {
      ElectronUpdater.autoUpdater.quitAndInstall();
    }
  });
};

const checkForUpdates = async (): Promise<void> => {
  if (isCheckingForUpdates || currentStatus.state !== "idle") {
    return;
  }

  isCheckingForUpdates = true;

  try {
    await ElectronUpdater.autoUpdater.checkForUpdates();
  } catch {
    // The error event above handles updater failures.
  } finally {
    isCheckingForUpdates = false;
  }
};

export const initializeAutoUpdates = (mainWindow: BrowserWindow): void => {
  registerUpdaterIpc();

  if (isInitialized || !canSelfUpdate()) {
    return;
  }

  isInitialized = true;
  ElectronUpdater.autoUpdater.autoDownload = true;
  ElectronUpdater.autoUpdater.autoInstallOnAppQuit = true;

  ElectronUpdater.autoUpdater.on("update-available", (info) => {
    updateStatus({ percent: 0, state: "downloading", version: info.version });
  });

  ElectronUpdater.autoUpdater.on("download-progress", (progress) => {
    const version =
      currentStatus.state === "downloading" ? currentStatus.version : app.getVersion();

    updateStatus({
      percent: Math.round(progress.percent),
      state: "downloading",
      version,
    });
  });

  ElectronUpdater.autoUpdater.on("update-downloaded", (info) => {
    updateStatus({ state: "ready", version: info.version });
  });

  ElectronUpdater.autoUpdater.on("update-not-available", () => {
    updateStatus({ state: "idle" });
  });

  ElectronUpdater.autoUpdater.on("error", () => {
    updateStatus({ state: "idle" });
    // Updates are best-effort and should never interrupt normal app startup.
  });

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      void checkForUpdates();
    }, UPDATE_CHECK_DELAY_MS);

    setInterval(() => {
      void checkForUpdates();
    }, UPDATE_CHECK_INTERVAL_MS);
  });
};
