import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const routes = ["404", "work", "work/cyberspace", "work/bug-party", "work/role-model"];

for (const route of routes) {
  if (route === "404") {
    copyFileSync(join(dist, "index.html"), join(dist, "404.html"));
    continue;
  }

  const routeDir = join(dist, route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(join(dist, "index.html"), join(routeDir, "index.html"));
}
