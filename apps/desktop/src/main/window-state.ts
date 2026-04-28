import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BrowserWindow } from "electron";
import { app, screen } from "electron";
import { Result, TaggedError } from "better-result";

const MIN_VISIBLE_WINDOW_EDGE_LENGTH = 100;
export const MIN_WINDOW_SIZE = {
  height: 560,
  width: 860,
} as const;

const WINDOW_STATE_FILE = "window-state.json";

interface WindowState {
  height: number;
  isMaximized?: boolean;
  width: number;
  x?: number;
  y?: number;
}

const DEFAULT_WINDOW_STATE: WindowState = {
  height: 670,
  width: 900,
};

const getWindowStatePath = (): string => join(app.getPath("userData"), WINDOW_STATE_FILE);

const formatErrorCause = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

type WindowStateErrorReason = "parse" | "read" | "validate" | "write";

const getWindowStateErrorMessage = (args: {
  cause?: unknown;
  path: string;
  reason: WindowStateErrorReason;
}): string => {
  switch (args.reason) {
    case "parse": {
      return `Failed to parse window state from ${args.path}: ${formatErrorCause(args.cause)}`;
    }
    case "read": {
      return `Failed to read window state from ${args.path}: ${formatErrorCause(args.cause)}`;
    }
    case "validate": {
      return `Window state in ${args.path} is missing valid width or height values`;
    }
    case "write": {
      return `Failed to write window state to ${args.path}: ${formatErrorCause(args.cause)}`;
    }
    default: {
      const exhaustiveReason: never = args.reason;
      return exhaustiveReason;
    }
  }
};

class WindowStateError extends TaggedError("WindowStateError")<{
  cause?: unknown;
  message: string;
  path: string;
  reason: WindowStateErrorReason;
}>() {
  constructor(args: { cause?: unknown; path: string; reason: WindowStateErrorReason }) {
    super({
      ...args,
      message: getWindowStateErrorMessage(args),
    });
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isWindowVisibleOnScreen = (
  bounds: Required<Pick<WindowState, "height" | "width" | "x" | "y">>,
): boolean =>
  screen.getAllDisplays().some(({ workArea }) => {
    const horizontalOverlap =
      Math.min(bounds.x + bounds.width, workArea.x + workArea.width) -
      Math.max(bounds.x, workArea.x);
    const verticalOverlap =
      Math.min(bounds.y + bounds.height, workArea.y + workArea.height) -
      Math.max(bounds.y, workArea.y);

    return (
      horizontalOverlap >= MIN_VISIBLE_WINDOW_EDGE_LENGTH &&
      verticalOverlap >= MIN_VISIBLE_WINDOW_EDGE_LENGTH
    );
  });

const readWindowStateFile = (windowStatePath: string): Result<string, WindowStateError> =>
  Result.try({
    catch: (cause) => new WindowStateError({ cause, path: windowStatePath, reason: "read" }),
    try: () => readFileSync(windowStatePath, "utf-8"),
  });

const parseWindowStateFile = (
  fileContents: string,
  windowStatePath: string,
): Result<unknown, WindowStateError> =>
  Result.try({
    catch: (cause) => new WindowStateError({ cause, path: windowStatePath, reason: "parse" }),
    try: () => JSON.parse(fileContents) as unknown,
  });

const normalizeWindowState = (
  parsedWindowState: unknown,
  windowStatePath: string,
): Result<WindowState, WindowStateError> => {
  if (
    !isRecord(parsedWindowState) ||
    !isFiniteNumber(parsedWindowState.width) ||
    !isFiniteNumber(parsedWindowState.height)
  ) {
    return Result.err(new WindowStateError({ path: windowStatePath, reason: "validate" }));
  }

  const windowState: WindowState = {
    height: Math.max(parsedWindowState.height, MIN_WINDOW_SIZE.height),
    width: Math.max(parsedWindowState.width, MIN_WINDOW_SIZE.width),
  };

  if (
    isFiniteNumber(parsedWindowState.x) &&
    isFiniteNumber(parsedWindowState.y) &&
    isWindowVisibleOnScreen({
      height: windowState.height,
      width: windowState.width,
      x: parsedWindowState.x,
      y: parsedWindowState.y,
    })
  ) {
    windowState.x = parsedWindowState.x;
    windowState.y = parsedWindowState.y;
  }

  if (parsedWindowState.isMaximized === true) {
    windowState.isMaximized = true;
  }

  return Result.ok(windowState);
};

const readPersistedWindowState = (
  windowStatePath: string,
): Result<WindowState, WindowStateError> => {
  const fileContents = readWindowStateFile(windowStatePath);

  if (!Result.isOk(fileContents)) {
    return fileContents;
  }

  const parsedWindowState = parseWindowStateFile(fileContents.value, windowStatePath);

  if (!Result.isOk(parsedWindowState)) {
    return parsedWindowState;
  }

  return normalizeWindowState(parsedWindowState.value, windowStatePath);
};

const persistWindowState = (windowState: WindowState): Result<void, WindowStateError> => {
  const windowStatePath = getWindowStatePath();

  return Result.try({
    catch: (cause) => new WindowStateError({ cause, path: windowStatePath, reason: "write" }),
    try: () => {
      mkdirSync(app.getPath("userData"), { recursive: true });
      writeFileSync(windowStatePath, `${JSON.stringify(windowState, null, 2)}\n`);
    },
  });
};

export const readWindowState = (): WindowState => {
  const windowStatePath = getWindowStatePath();

  if (!existsSync(windowStatePath)) {
    return DEFAULT_WINDOW_STATE;
  }

  const windowState = readPersistedWindowState(windowStatePath);
  return Result.isOk(windowState) ? windowState.value : DEFAULT_WINDOW_STATE;
};

export const writeWindowState = (window: BrowserWindow): void => {
  if (window.isMinimized() || window.isFullScreen()) {
    return;
  }

  const bounds = window.isMaximized() ? window.getNormalBounds() : window.getBounds();
  const windowState: WindowState = {
    ...bounds,
    isMaximized: window.isMaximized(),
  };

  const writeResult = persistWindowState(windowState);

  if (!Result.isOk(writeResult)) {
    // Persisting window state is best-effort and should never block startup.
  }
};
