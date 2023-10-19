import { getTailwindClassNumber } from "./index";
import { test, expect } from "vitest";

test("classname don's have number, should throw", () => {
  const fontSize = "text-sm";
  expect(() => getTailwindClassNumber(fontSize)).toThrow();
});

test("should only support px and rem unit", () => {
  const fontSize = "text-[2vw]";
  expect(() => getTailwindClassNumber(fontSize)).toThrow();
});

test("should calculate correct number from normal numerous tailwind css class", () => {
  const lineHeight = "leading-4";
  const lineHeightNum = getTailwindClassNumber(lineHeight);
  expect(lineHeightNum).toBe(16);

  const width = "w-10";
  const widthNum = getTailwindClassNumber(width);
  expect(widthNum).toBe(40);

  const height = "h-100";
  const heightNum = getTailwindClassNumber(height);
  expect(heightNum).toBe(400);
});

test("should calculate correct number with arbitrary classname", () => {
  const lineHeight = "leading-[4px]";
  const lineHeightNum = getTailwindClassNumber(lineHeight);
  expect(lineHeightNum).toBe(4);

  const width = "text-[4rem]";
  const widthNum = getTailwindClassNumber(width);
  expect(widthNum).toBe(16);
});

test("should throw if input is not a complete arbitrary classname", () => {
  const badLineHeight = "leading-4px]";
  expect(() => getTailwindClassNumber(badLineHeight)).toThrow();

  const badWidth = "leading-[4rem";
  expect(() => getTailwindClassNumber(badWidth)).toThrow();
});
