import { test, expect } from "vitest";
import { getReferencesFromString } from "./getReferencesFromString";

test("should get reference from basic string", () => {
  const value = "${hello.world}";

  const references = getReferencesFromString(value);

  expect(references).toStrictEqual([
    {
      originalValue: value,
      referenceValue: {
        withCurlyBraces: value,
        withoutCurlyBraces: "hello.world",
      },
    },
  ]);
});

test("should not get reference from basic string without correct syntax", () => {
  const valueWithoutDollar = "{hello.world}";
  expect(getReferencesFromString(valueWithoutDollar)).toStrictEqual([]);
  const valueWithoutCurlyBrace = "$hello.world";
  expect(getReferencesFromString(valueWithoutCurlyBrace)).toStrictEqual([]);
  const valueWithBrokenCurlyBrace = "${hello.world";
  expect(getReferencesFromString(valueWithBrokenCurlyBrace)).toStrictEqual([]);
});

test("should get reference from string with space", () => {
  const value = "${hello world}";

  const references = getReferencesFromString(value);

  expect(references).toStrictEqual([
    {
      originalValue: value,
      referenceValue: {
        withCurlyBraces: value,
        withoutCurlyBraces: "hello world",
      },
    },
  ]);
});

test("should get reference from string with square brace", () => {
  const value = "${foo.output['yolo']}";

  const references = getReferencesFromString(value);

  expect(references).toStrictEqual([
    {
      originalValue: value,
      referenceValue: {
        withCurlyBraces: value,
        withoutCurlyBraces: "foo.output['yolo']",
      },
    },
  ]);
});

test("should get reference from string with multiple square brace", () => {
  const value = "${foo.output['yolo']['bar']}";

  const references = getReferencesFromString(value);

  expect(references).toStrictEqual([
    {
      originalValue: value,
      referenceValue: {
        withCurlyBraces: value,
        withoutCurlyBraces: "foo.output['yolo']['bar']",
      },
    },
  ]);
});

test("should get reference from string with space in square brace", () => {
  const value = "${foo.output['yolo bar']}";

  const references = getReferencesFromString(value);

  expect(references).toStrictEqual([
    {
      originalValue: value,
      referenceValue: {
        withCurlyBraces: value,
        withoutCurlyBraces: "foo.output['yolo bar']",
      },
    },
  ]);
});
