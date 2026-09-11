import { expect, test } from "@playwright/test";

test("lays out the five Untitled Land film stills as three desktop columns and one mobile column", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/untitled-land");

  const gallery = page.getByRole("region", { name: "Untitled Land image gallery" });
  await expect(gallery.getByRole("img")).toHaveCount(5);
  await expect(gallery).toHaveCSS("grid-template-columns", /^\S+\s+\S+\s+\S+$/);

  await page.setViewportSize({ width: 375, height: 900 });
  await expect(gallery).toHaveCSS("grid-template-columns", /^\S+$/);
});
