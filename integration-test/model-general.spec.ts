import { test, expect } from "@playwright/test";

export function handleGeneralModelTest() {
  test.describe.serial("Create model", () => {
    test("should warn wrong resource ID", async ({ page }) => {
      await page.goto("/models/create");

      // Should input model id
      const idInput = page.locator("input#model-id");
      await idInput.fill("Wrong-id");

      const warningLabel = page.locator("data-testid=model-id-label-error");
      await expect(warningLabel).toHaveText(
        "Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
      );
    });
  });
}
