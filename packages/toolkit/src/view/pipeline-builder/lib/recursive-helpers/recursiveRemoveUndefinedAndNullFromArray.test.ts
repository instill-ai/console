import { test, expect } from "vitest";
import { recursiveRemoveUndefinedAndNullFromArray } from "./recursiveRemoveUndefinedAndNullFromArray";

test("should remove undefined and null from array", () => {
  const array = [
    1,
    2,
    undefined,
    null,
    3,
    undefined,
    null,
    4,
    undefined,
    null,
    5,
  ];

  const result = recursiveRemoveUndefinedAndNullFromArray(array);

  expect(result).toEqual([1, 2, 3, 4, 5]);
});

test("should remove undefined and null from array inside a object", () => {
  const object = {
    a: [1, 2, undefined, null, 3, undefined, null, 4, undefined, null, 5],
  };

  const result = recursiveRemoveUndefinedAndNullFromArray(object);

  expect(result).toEqual({ a: [1, 2, 3, 4, 5] });
});
