import { defineConfig } from "oxlint";

import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react],
  ignorePatterns: [
    "apps/desktop/src/renderer/src/components/ui/**/*",
    "apps/desktop/src/renderer/src/routeTree.gen.ts",
  ],
});
