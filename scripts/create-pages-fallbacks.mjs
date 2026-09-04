import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const routes = [
  "404",
  "work",
  "music",
  "live",
  "practice",
  "press-radio",
  "about",
  "epk",
  "work/cyberspace",
  "work/bug-party",
  "work/role-model",
  "work/fancy-a-bite",
  "work/two-dreadful-children-unipre",
  "work/no-idea",
  "practice/no-idea/2026-05-23",
  "work/openband-openscore",
  "work/untitled-land",
  "work/paradise-dream-2",
  "work/clouds-from-underground",
  "work/cctv-selected-broadcast-work"
];

for (const route of routes) {
  if (route === "404") {
    copyFileSync(join(dist, "index.html"), join(dist, "404.html"));
    continue;
  }

  const routeDir = join(dist, route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(join(dist, "index.html"), join(routeDir, "index.html"));
}
