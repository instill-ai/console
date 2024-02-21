import { test, expect } from "vitest";
import { pickSmartHintsFromAcceptFormats } from "./pickSmartHintsFromAcceptFormats";

test("should pick hints when accept format is *", () => {
  const hints = [
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "root.images",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "null",
    },
  ];

  const pickHints = pickSmartHintsFromAcceptFormats(hints, ["*"]);
  expect(pickHints).toStrictEqual(hints);

  const arrayHints = [
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

  const pickArrayHints = pickSmartHintsFromAcceptFormats(arrayHints, ["*"]);
  expect(pickArrayHints).toStrictEqual(arrayHints);
});

test("should pick hints when accept format is */*", () => {
  const hints = [
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "root.images",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "null",
    },
  ];

  const pickHints = pickSmartHintsFromAcceptFormats(hints, ["*/*"]);
  expect(pickHints).toStrictEqual(hints);

  const arrayHints = [
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

  const pickArrayHints = pickSmartHintsFromAcceptFormats(arrayHints, ["*/*"]);
  expect(pickArrayHints).toStrictEqual(arrayHints);
});

test("should pick hints from non objectArray hints", () => {
  const hints = [
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "root.images",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "null",
    },
  ];

  const instillAcceptFormats = ["string"];

  const pickHints = pickSmartHintsFromAcceptFormats(
    hints,
    instillAcceptFormats
  );

  expect(pickHints).toStrictEqual([
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
  ]);
});

test("should pick hints from non objectArray hints with complicated array format", () => {
  const hints = [
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "root.arrayNum",
      key: "texts",
      instillFormat: "array:number",
      type: "null",
    },
    {
      path: "root.semiStructured",
      key: "texts",
      instillFormat: "semi-structured/*",
      type: "null",
    },
    {
      path: "root.image",
      key: "texts",
      instillFormat: "image/*",
      type: "array",
    },
    {
      path: "root.jpeg",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "array",
    },
    {
      path: "root.jpegs",
      key: "texts",
      instillFormat: "array:image/jpeg",
      type: "array",
    },
    {
      path: "root.images",
      key: "texts",
      instillFormat: "array:image/*",
      type: "array",
    },
  ];

  const pickImage = pickSmartHintsFromAcceptFormats(hints, ["image/*"]);

  expect(pickImage).toStrictEqual([
    {
      path: "root.image",
      key: "texts",
      instillFormat: "image/*",
      type: "array",
    },
    {
      path: "root.jpeg",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "array",
    },
  ]);

  // This is a special rule of instill-ai protocol. Although the field only accept image/jpeg
  // We will still hint user a universal image/* field to make sure the experience is good
  // When the pipeline fails to the non-correct format, backedn will throw runtime error
  const pickJpeg = pickSmartHintsFromAcceptFormats(hints, ["image/jpeg"]);

  expect(pickJpeg).toStrictEqual([
    {
      path: "root.image",
      key: "texts",
      instillFormat: "image/*",
      type: "array",
    },
    {
      path: "root.jpeg",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "array",
    },
  ]);

  const pickSemiStructured = pickSmartHintsFromAcceptFormats(hints, [
    "semi-structured/*",
  ]);

  expect(pickSemiStructured).toStrictEqual([
    {
      path: "root.semiStructured",
      key: "texts",
      instillFormat: "semi-structured/*",
      type: "null",
    },
  ]);
});

test("should pick hints from objectArray hints", () => {
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

test("should pick hints when accept format is array:*", () => {
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

  const pickHints = pickSmartHintsFromAcceptFormats(hints, ["array:*"]);

  expect(pickHints).toStrictEqual([
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
  ]);
});

test("should pick hints when accept format is string from non objectArray hints", () => {
  const hints = [
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "root.arrayNum",
      key: "texts",
      instillFormat: "array:number",
      type: "null",
    },
    {
      path: "root.semiStructured",
      key: "texts",
      instillFormat: "semi-structured/*",
      type: "null",
    },
    {
      path: "root.images",
      key: "texts",
      instillFormat: "image/jpeg",
      type: "array",
    },
  ];

  const pickHints = pickSmartHintsFromAcceptFormats(hints, ["string"]);

  expect(pickHints).toStrictEqual([
    {
      path: "root.texts",
      key: "texts",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "root.arrayNum",
      key: "texts",
      instillFormat: "array:number",
      type: "null",
    },
    {
      path: "root.semiStructured",
      key: "texts",
      instillFormat: "semi-structured/*",
      type: "null",
    },
  ]);
});

test("should pick hints when accept format is string from objectArray hints", () => {
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
          path: "root.arrayNum",
          key: "texts",
          instillFormat: "array:number",
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

  const pickHints = pickSmartHintsFromAcceptFormats(hints, ["string"]);

  expect(pickHints).toStrictEqual([
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
          path: "root.arrayNum",
          key: "texts",
          instillFormat: "array:number",
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
