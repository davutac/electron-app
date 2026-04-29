import { ipcMain } from "electron";
import { Result } from "better-result";
import type { Result as ResultType } from "better-result";
import { startDatabase } from "./database";
import type { DatabaseError } from "./database";

const APP_START_CHANNEL = "app:start";

let areIpcHandlersRegistered = false;
let startupPromise: Promise<AppStartupResult> | null = null;

type AppStartupError = DatabaseError;
type AppStartupResult = ResultType<void, AppStartupError>;
type StartupTask = () => AppStartupResult | Promise<AppStartupResult>;

const startupTasks: readonly StartupTask[] = [startDatabase];

const runStartupTasks = async (): Promise<AppStartupResult> => {
  for (const task of startupTasks) {
    const taskResult = await task();

    if (!Result.isOk(taskResult)) {
      return taskResult;
    }
  }

  return Result.ok();
};

const runStartupTasksOnce = async (): Promise<AppStartupResult> => {
  const result = await runStartupTasks();

  if (!Result.isOk(result)) {
    startupPromise = null;
  }

  return result;
};

export const startApp = (): Promise<AppStartupResult> => {
  startupPromise ??= runStartupTasksOnce();

  return startupPromise;
};

export const registerAppStartupIpc = (): void => {
  if (areIpcHandlersRegistered) {
    return;
  }

  areIpcHandlersRegistered = true;

  ipcMain.handle(APP_START_CHANNEL, async () => Result.serialize(await startApp()));
};
