import { test, expect } from "vitest";
import { transformPipelineTriggerRequestFieldsToSmartHints } from "./transformPipelineTriggerRequestFieldsToSmartHints";
import { PipelineVariableFieldMap } from "../vdp-sdk";

test("should transform pipeline variables to smart hints", () => {
  const fields: PipelineVariableFieldMap = {
    text: {
      instillFormat: "string",
      title: "Foo",
    },
    audio: {
      instillFormat: "audio/*",
      title: "Audio",
    },
  };

  const hints = transformPipelineTriggerRequestFieldsToSmartHints(fields);

  expect(hints).toStrictEqual([
    {
      path: "variable.text",
      key: "text",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "variable.audio",
      key: "audio",
      instillFormat: "audio/*",
      type: "null",
    },
  ]);
});

test("should transform start operator metadata to smart hints with empty metadata", () => {
  const hints = transformPipelineTriggerRequestFieldsToSmartHints({});
  expect(hints).toStrictEqual([]);
});

test("should transform array metadata to smart hints", () => {
  const fields: PipelineVariableFieldMap = {
    text: {
      instillFormat: "array:string",
      title: "Text",
    },
    images: {
      instillFormat: "array:image/*",
      title: "Images",
    },
  };

  const hints = transformPipelineTriggerRequestFieldsToSmartHints(fields);

  expect(hints).toStrictEqual([
    {
      path: "variable.text",
      key: "text",
      instillFormat: "array:string",
      type: "null",
    },
    {
      path: "variable.images",
      key: "images",
      instillFormat: "array:image/*",
      type: "null",
    },
  ]);
});
