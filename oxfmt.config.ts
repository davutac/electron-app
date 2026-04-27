import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  extends: [ultracite],
  ignorePatterns: [
    "apps/desktop/src/renderer/src/routeTree.gen.ts",
    "apps/desktop/src/renderer/src/components/ui/**/*",
  ],
});
