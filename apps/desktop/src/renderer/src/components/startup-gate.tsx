import StartupSplash from "@/components/startup-splash";
import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { Result, TaggedError } from "better-result";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { routeTree } from "../routeTree.gen";

const router = createRouter({
  history: createHashHistory(),
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const MIN_SPLASH_DURATION_MS = 1000;
const SHOULD_ENFORCE_MIN_SPLASH_DURATION = import.meta.env.DEV;

class AppStartupIpcError extends TaggedError("AppStartupIpcError")<{
  message: string;
}>() {
  constructor() {
    super({ message: "Could not start the app" });
  }
}

const StartupGate = () => {
  const [hasMinimumSplashDurationElapsed, setHasMinimumSplashDurationElapsed] = useState(
    !SHOULD_ENFORCE_MIN_SPLASH_DURATION,
  );
  const [hasStartupFinished, setHasStartupFinished] = useState(false);
  const [hasStartupFailed, setHasStartupFailed] = useState(false);

  const startApp = useCallback(async (): Promise<void> => {
    setHasStartupFailed(false);

    if (!window.api?.app) {
      setHasStartupFinished(true);
      return;
    }

    const ipcResult = await Result.tryPromise({
      catch: () => new AppStartupIpcError(),
      try: () => window.api.app.start(),
    });

    if (!Result.isOk(ipcResult)) {
      setHasStartupFailed(true);
      return;
    }

    const startupResult = Result.deserialize<undefined, unknown>(ipcResult.value);

    if (!Result.isOk(startupResult)) {
      setHasStartupFailed(true);
      return;
    }

    setHasStartupFinished(true);
  }, []);

  useEffect(() => {
    if (!SHOULD_ENFORCE_MIN_SPLASH_DURATION) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHasMinimumSplashDurationElapsed(true);
    }, MIN_SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    void startApp();
  }, [startApp]);

  const canRenderRoutes = hasStartupFinished && hasMinimumSplashDurationElapsed;

  return (
    <>
      {canRenderRoutes ? <RouterProvider router={router} /> : null}
      <AnimatePresence initial={false}>
        {canRenderRoutes ? null : (
          <StartupSplash hasError={hasStartupFailed} key="startup-splash" onRetry={startApp} />
        )}
      </AnimatePresence>
    </>
  );
};

export default StartupGate;
