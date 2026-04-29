import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    build: {
      externalizeDeps: {
        exclude: ["@repo/database"],
        include: ["better-sqlite3"],
      },
    },
    resolve: {
      alias: [{ find: "@/constants", replacement: resolve("src/constants.ts") }],
    },
  },
  preload: {},
  renderer: {
    plugins: [
      tanstackRouter({
        generatedRouteTree: "./src/routeTree.gen.ts",
        routesDirectory: "./src/routes",
        target: "react",
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: "@/constants", replacement: resolve("src/constants.ts") },
        { find: "@/renderer", replacement: resolve("src/renderer/src") },
        { find: "@", replacement: resolve("src/renderer/src") },
      ],
    },
  },
});
