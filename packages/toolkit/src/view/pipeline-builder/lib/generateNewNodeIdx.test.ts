import { test, expect } from "vitest";
import { generateNewNodeIdx } from "./generateNewNodeIdx";

test("should generate new node idx", () => {
	const nodeIDs = ["ai_0", "ai_1", "ai_5", "ai_2", "ai_6"];

	const idx = generateNewNodeIdx(nodeIDs, "ai");

	expect(idx).toBe(3);
});
