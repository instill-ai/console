import { expect, test } from "@playwright/test";

export function skeletonTest() {
  test.describe.serial("Skeleton test", () => {
    test("should pass", async () => {
      expect(true).toBe(true);
    });
  });
}
