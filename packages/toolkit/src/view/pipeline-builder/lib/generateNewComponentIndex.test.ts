import { expect, test } from "vitest";

import { generateUniqueIndex } from "./generateUniqueIndex";

test("should generate new node idx", () => {
  const nodeIDs = ["ai-0", "ai-1", "ai-5", "ai-2", "ai-6"];

  const idx = generateUniqueIndex(nodeIDs, "ai");

  expect(idx).toBe(3);
});
