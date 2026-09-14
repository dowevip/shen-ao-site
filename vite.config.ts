import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Custom domain (https://shenaomusic.com/) — site is served from the domain root.
  base: "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    exclude: ["node_modules/**", "dist/**", "tests/**"]
  }
});
