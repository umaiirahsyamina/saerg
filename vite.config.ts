import { defineConfig } from "vitest/config";

// The site is served from https://<user>.github.io/saerg/ on GitHub Pages,
// so every asset URL must start with the repository name.
// If the repository is ever renamed, change this one line.
const GITHUB_PAGES_BASE = "/saerg/";

export default defineConfig(({ command }) => ({
  // Use the Pages sub-path for production builds and "/" for the local dev server.
  base: command === "build" ? GITHUB_PAGES_BASE : "/",
  build: {
    target: "es2022",
    // Babylon.js is a large library even when tree-shaken; raise the warning limit a little.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    // Game logic (state machine, timer, scoring) is pure TypeScript, so Node is enough.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
}));
