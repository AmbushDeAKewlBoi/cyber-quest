import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "cyber-quest";

export default defineConfig({
  root: "static-site",
  base: `/${repositoryName}/`,
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
  },
});
