import { Locator, Page } from "@playwright/test";

export async function getSelectContent(
  page: Page,
  trigger: Locator,
): Promise<Locator> {
  const ariaControls = await trigger.getAttribute("aria-controls");
  // Radix is using id with colon, we need to escape it
  const escapedAriaControls = ariaControls?.replaceAll(":", "\\:");
  return page.locator(`div[id='${escapedAriaControls}']`);
}
