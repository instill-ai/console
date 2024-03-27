import { test, expect } from "vitest";
import { removeObjKey } from "./removeObjKey";

test("should remove key from object", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };

  const result = removeObjKey(obj, "b");

  expect(result).toEqual({
    a: 1,
    c: 3,
  });
});

test("should return same object if key not found", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  };

  const result = removeObjKey(obj, "d");

  expect(result).toEqual({
    a: 1,
    b: 2,
    c: 3,
  });
});

test("should return empty object if object is empty", () => {
  const obj = {};

  const result = removeObjKey(obj, "d");

  expect(result).toEqual({});
});
