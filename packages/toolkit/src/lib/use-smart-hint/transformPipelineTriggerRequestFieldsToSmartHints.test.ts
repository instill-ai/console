import { test, expect } from "vitest";
import { transformPipelineTriggerRequestFieldsToSmartHints } from "./transformPipelineTriggerRequestFieldsToSmartHints";
import { PipelineVariableFieldMap } from "../vdp-sdk";

test("should transform pipeline variables to smart hints", () => {
  const fields: PipelineVariableFieldMap = {
    text: {
      instill_format: "string",
      title: "Foo",
    },
    audio: {
      instill_format: "audio/*",
      title: "Audio",
    },
  };

  const hints = transformPipelineTriggerRequestFieldsToSmartHints(fields);

  expect(hints).toStrictEqual([
    {
      path: "trigger.text",
      key: "text",
      instillFormat: "string",
      type: "null",
    },
    {
      path: "trigger.audio",
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
      instill_format: "array:string",
      title: "Text",
    },
    images: {
      instill_format: "array:image/*",
      title: "Images",
    },
  };

  const hints = transformPipelineTriggerRequestFieldsToSmartHints(fields);

  expect(hints).toStrictEqual([
    {
      path: "trigger.text",
      key: "text",
      instillFormat: "array:string",
      type: "null",
    },
    {
      path: "trigger.images",
      key: "images",
      instillFormat: "array:image/*",
      type: "null",
    },
  ]);
});
