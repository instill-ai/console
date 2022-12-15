import { test, expect } from "@playwright/test";
import { expectToSelectReactSelectOption } from "./helper";

test.use({
  launchOptions: {
    slowMo: 50,
  },
});

test.describe.serial("Create model", () => {
  test("should warn wrong resource ID", async ({ page }) => {
    await page.goto("/models/create");

    // Should input model id
    const idInput = page.locator("input#modelId");
    await idInput.fill("Wrong-id");

    // Should select GitHub model
    await expectToSelectReactSelectOption(
      page.locator("#react-select-modelDefinition-input"),
      page.locator("data-testid=modelDefinition-selected-option", {
        hasText: "Github",
      })
    );

    // Should input GitHub repo url
    const githubRepoInput = page.locator("input#modelRepo");
    await githubRepoInput.fill("instill-ai/model-mobilenetv2");

    // Should click set up button
    const setupButton = page.locator("button", { hasText: "Set up" });
    await setupButton.click();

    // Should have warning label
    const warningLabel = page.locator("label[for='modelId']");
    await expect(warningLabel).toHaveText(
      "ID * - Resource ID restricts to lowercase letters, numbers, and hyphen, with the first character a letter, the last a letter or a number, and a 63 character maximum."
    );
  });
});
