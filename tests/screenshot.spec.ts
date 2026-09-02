import { expect, test } from "@playwright/test";

const screenshotDir = "screenshots";

test("capture Round 1 review screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SHEN AO" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/home-desktop.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 1200 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SHEN AO" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/home-mobile.png`, fullPage: true });

  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/work");
  await expect(page.getByRole("heading", { name: "WORK" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/work.png`, fullPage: true });

  await page.goto("/work/cyberspace");
  await expect(page.getByRole("heading", { name: "CYBERSPACE" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/cyberspace-detail.png`, fullPage: true });

  await page.goto("/work/bug-party");
  await expect(page.getByRole("heading", { name: "BUG PARTY" })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/bug-party-detail.png`, fullPage: true });
});
