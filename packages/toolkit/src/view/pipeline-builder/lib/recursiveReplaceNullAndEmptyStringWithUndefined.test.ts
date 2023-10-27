import { test, expect } from "vitest";
import { recursiveReplaceNullAndEmptyStringWithUndefined } from "./recursiveReplaceNullAndEmptyStringWithUndefined";

test("should replace null and empty string with undefined", () => {
  const obj = {
    number: 0.4,
    string: "string",
    foo: {
      bar: "yes!",
      empty: "",
    },
    bar: null,
  };

  recursiveReplaceNullAndEmptyStringWithUndefined(obj);

  expect(obj).toEqual({
    number: 0.4,
    string: "string",
    foo: { bar: "yes!", empty: undefined },
    bar: undefined,
  });
});
