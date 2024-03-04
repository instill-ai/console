import { test, expect } from "vitest";
import { PipelineStartComponentFields } from "../vdp-sdk";
import { transformStartOperatorFieldsToSmartHints } from "./transformStartOperatorFieldsToSmartHints";

test("should transform start operator metadata to smart hints", () => {
  const fields: PipelineStartComponentFields = {
    text: {
      instill_format: "string",
      title: "Foo",
    },
    audio: {
      instill_format: "audio/*",
      title: "Audio",
    },
  };

  const hints = transformStartOperatorFieldsToSmartHints(fields);

  expect(hints).toStrictEqual([
    {
      path: "start.text",
      key: "text",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "start.audio",
      key: "audio",
      instillFormat: "audio/*",
      type: "null",
    },
  ]);
});

test("should transform start operator metadata to smart hints with empty metadata", () => {
  const hints = transformStartOperatorFieldsToSmartHints({});
  expect(hints).toStrictEqual([]);
});

test("should transform array metadata to smart hints", () => {
  const fields: PipelineStartComponentFields = {
    text: {
      instill_format: "array:string",
      title: "Text",
    },
    images: {
      instill_format: "array:image/*",
      title: "Images",
    },
  };

  const hints = transformStartOperatorFieldsToSmartHints(fields);

  expect(hints).toStrictEqual([
    {
      path: "start.text",
      key: "text",
      instillFormat: "array:string",
      type: "null",
    },
    {
      path: "start.images",
      key: "images",
      instillFormat: "array:image/*",
      type: "null",
    },
  ]);
});
