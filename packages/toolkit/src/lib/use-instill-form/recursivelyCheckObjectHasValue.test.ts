import { test, expect } from "vitest";
import { recursivelyCheckObjectHasValue } from "./recursivelyCheckObjectHasValue";

test("should check simple object has value", () => {
  const obj = {};

  expect(recursivelyCheckObjectHasValue(obj)).toBe(false);

  const hasValueObj = {
    a: 1,
  };

  expect(recursivelyCheckObjectHasValue(hasValueObj)).toBe(true);
});

test("should check nested object has value", () => {
  const hasValueObj = {
    a: {
      b: {
        c: [],
      },
    },
  };

  expect(recursivelyCheckObjectHasValue(hasValueObj)).toBe(true);

  const obj = {
    a: {
      b: {
        c: {},
      },
    },
  };

  expect(recursivelyCheckObjectHasValue(obj)).toBe(false);

  const obj2 = {
    a: "boo",
    b: {},
  };

  expect(recursivelyCheckObjectHasValue(obj2)).toBe(true);
});
