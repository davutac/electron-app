import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BrowserWindow } from "electron";
import { app, screen } from "electron";

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

export const readWindowState = (): WindowState => {
  const windowStatePath = getWindowStatePath();

  if (!existsSync(windowStatePath)) {
    return DEFAULT_WINDOW_STATE;
  }

  try {
    const parsedWindowState: unknown = JSON.parse(readFileSync(windowStatePath, "utf-8"));

    if (
      !isRecord(parsedWindowState) ||
      !isFiniteNumber(parsedWindowState.width) ||
      !isFiniteNumber(parsedWindowState.height)
    ) {
      return DEFAULT_WINDOW_STATE;
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

    return windowState;
  } catch {
    return DEFAULT_WINDOW_STATE;
  }
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

  try {
    mkdirSync(app.getPath("userData"), { recursive: true });
    writeFileSync(getWindowStatePath(), `${JSON.stringify(windowState, null, 2)}\n`);
  } catch {
    // Persisting window state is best-effort and should never block startup.
  }
};
