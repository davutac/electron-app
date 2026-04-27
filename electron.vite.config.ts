import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {},
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
      alias: {
        "@": resolve("src/renderer/src"),
        "@renderer": resolve("src/renderer/src"),
      },
    },
  },
});
