import { test, expect } from "vitest";
import { recursiveParseToNum } from "./recursiveParseToNum";

test("should parse basic primitive", () => {
  const stringOne = "1";
  const stringOneResult = recursiveParseToNum(stringOne);
  expect(stringOneResult).toBe(1);

  const stringZero = "0";
  const stringZeroResult = recursiveParseToNum(stringZero);
  expect(stringZeroResult).toBe(0);

  const stringNegativeOne = "-1";
  const stringNegativeOneResult = recursiveParseToNum(stringNegativeOne);
  expect(stringNegativeOneResult).toBe(-1);
});

test("should parse basic primitive with whitespace", () => {
  const stringOne = " 1 ";
  const stringOneResult = recursiveParseToNum(stringOne);
  expect(stringOneResult).toBe(1);

  const stringZero = " 0 ";
  const stringZeroResult = recursiveParseToNum(stringZero);
  expect(stringZeroResult).toBe(0);

  const stringNegativeOne = " -1 ";
  const stringNegativeOneResult = recursiveParseToNum(stringNegativeOne);
  expect(stringNegativeOneResult).toBe(-1);
});

test("should parse basic primitive with whitespace and newlines", () => {
  const stringOne = "\n1\n";
  const stringOneResult = recursiveParseToNum(stringOne);
  expect(stringOneResult).toBe(1);

  const stringZero = "\n0\n";
  const stringZeroResult = recursiveParseToNum(stringZero);
  expect(stringZeroResult).toBe(0);

  const stringNegativeOne = "\n-1\n";
  const stringNegativeOneResult = recursiveParseToNum(stringNegativeOne);
  expect(stringNegativeOneResult).toBe(-1);
});

test("should failover to original value if not a number", () => {
  const stringOne = "one";
  const stringOneResult = recursiveParseToNum(stringOne);
  expect(stringOneResult).toBe("one");
});
