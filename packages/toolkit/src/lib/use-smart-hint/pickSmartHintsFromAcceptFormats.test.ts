import { test, expect } from "vitest";
import { pickSmartHintsFromAcceptFormats } from "./pickSmartHintsFromAcceptFormats";

test("should pick hints from non-array hints", () => {
  const hints = [
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "text/plain",
      type: "array",
    },
    {
      path: "root.images",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "array",
    },
  ];

  const instillAcceptFormats = ["text/plain"];

  const pickHints = pickSmartHintsFromAcceptFormats(
    hints,
    instillAcceptFormats
  );

  expect(pickHints).toStrictEqual([
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "text/plain",
      type: "array",
    },
  ]);
});

test("should pick hints from array hints", () => {
  const hints = [
    {
      path: "root.segments",
      key: "segments",
      instillFormat: "null",
      type: "array",
      properties: [
        {
          path: "root.segments.label",
          key: "label",
          instillFormat: "string",
          type: "null",
        },
        {
          path: "root.segments.mask",
          key: "mask",
          instillFormat: "image/jpeg",
          type: "null",
        },
        {
          path: "root.segments.score",
          key: "score",
          instillFormat: "number",
          type: "null",
        },
      ],
    },
  ];

  const hasNoPickHints = pickSmartHintsFromAcceptFormats(hints, ["image/png"]);

  expect(hasNoPickHints).toStrictEqual([]);

  const hasPickHints = pickSmartHintsFromAcceptFormats(hints, [
    "image/jpeg",
    "number",
  ]);

  expect(hasPickHints).toStrictEqual([
    {
      path: "root.segments",
      key: "segments",
      instillFormat: "null",
      type: "array",
      properties: [
        {
          path: "root.segments.mask",
          key: "mask",
          instillFormat: "image/jpeg",
          type: "null",
        },
        {
          path: "root.segments.score",
          key: "score",
          instillFormat: "number",
          type: "null",
        },
      ],
    },
  ]);
});
