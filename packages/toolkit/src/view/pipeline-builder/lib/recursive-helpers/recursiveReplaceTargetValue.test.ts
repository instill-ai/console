import { test, expect } from "vitest";
import { recursiveReplaceTargetValue } from "./recursiveReplaceTargetValue";

test("Should replace target value from array", () => {
  const array = ["**MASK**", 1, "hello"];

  const result = recursiveReplaceTargetValue(array, "**MASK**", "world");

  expect(result).toEqual(["world", 1, "hello"]);
});

test("Should replace target value from object", () => {
  const object = {
    a: "**MASK**",
    b: 1,
    c: "hello",
  };

  const result = recursiveReplaceTargetValue(object, "**MASK**", "world");

  expect(result).toStrictEqual({ a: "world", b: 1, c: "hello" });
});
