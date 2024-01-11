import { test, expect } from "vitest";
import { recursiveParseNumberToString } from "./recursiveParseNumberToString";

test("Should parse number to string", () => {
  const result = recursiveParseNumberToString(1);

  expect(result).toBe("1");
});

test("Should not parse boolean to string", () => {
  const result = recursiveParseNumberToString(true);

  expect(result).toBe(true);
});

test("Should not parse null to string", () => {
  const result = recursiveParseNumberToString(null);

  expect(result).toBeNull();
});

test("Should not parse undefined to string", () => {
  const result = recursiveParseNumberToString(undefined);

  expect(result).toBeUndefined();
});

test("Should parse number in array to string", () => {
  const result = recursiveParseNumberToString([1, 2, 3]);

  expect(result).toEqual(["1", "2", "3"]);
});

test("Should parse number in object to string", () => {
  const result = recursiveParseNumberToString({
    a: 1,
    b: 2,
    c: 3,
  });

  expect(result).toEqual({
    a: "1",
    b: "2",
    c: "3",
  });
});

test("Should parse number in nested object to string", () => {
  const result = recursiveParseNumberToString({
    foo: {
      a: 1,
      b: 2,
      c: 3,
    },
    bar: [1, 2, 3],
  });

  expect(result).toEqual({
    foo: {
      a: "1",
      b: "2",
      c: "3",
    },
    bar: ["1", "2", "3"],
  });
});
