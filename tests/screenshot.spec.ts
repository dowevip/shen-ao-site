import { expect, test } from "@playwright/test";

const screenshotDir = "screenshots";

test("capture Round 1 review screenshots", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SHEN AO", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/home-desktop-full.png`, fullPage: true });

  await page.setViewportSize({ width: 1180, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SHEN AO", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/home-laptop.png`, fullPage: true });

  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/work");
  await expect(page.getByRole("heading", { name: "WORK", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/work.png`, fullPage: true });

  await page.goto("/music");
  await expect(page.getByRole("heading", { name: "MUSIC", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/music.png`, fullPage: true });

  await page.goto("/live");
  await expect(page.getByRole("heading", { name: "LIVE", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/live.png`, fullPage: true });

  await page.goto("/practice");
  await expect(page.getByRole("heading", { name: "PRACTICE", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/practice.png`, fullPage: true });

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "ABOUT", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/about.png`, fullPage: true });

  await page.goto("/epk");
  await expect(page.getByRole("heading", { name: "SHEN AO", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/epk.png`, fullPage: true });

  await page.goto("/work/role-model");
  await expect(page.getByRole("heading", { name: "ROLE MODEL", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/role-model-detail.png`, fullPage: true });

  await page.goto("/work/cyberspace");
  await expect(page.getByRole("heading", { name: "CYBERSPACE", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/cyberspace-detail.png`, fullPage: true });

  await page.setViewportSize({ width: 390, height: 1200 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SHEN AO", exact: true })).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/home-mobile.png`, fullPage: true });
});
