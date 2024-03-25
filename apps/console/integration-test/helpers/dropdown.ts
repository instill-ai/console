import { Locator, Page } from "@playwright/test";

export async function getDropdownContent(
  page: Page,
  trigger: Locator
): Promise<Locator> {
  const id = await trigger.getAttribute("id");
  // Radix is using id with colon, we need to escape it
  const escapedID = id?.replaceAll(":", "\\:");
  return page.locator(`div[aria-labelledby='${escapedID}']`);
}
