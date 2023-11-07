import { test, expect } from "vitest";
import { StartOperatorMetadata } from "../vdp-sdk";
import { transformStartOperatorMetadataToSmartHints } from "./transformStartOperatorMetadataToSmartHints";

test("should transform start operator metadata to smart hints", () => {
  const metadata: StartOperatorMetadata = {
    text: {
      type: "string",
      instillFormat: "string",
      title: "Foo",
    },
    audio: {
      type: "string",
      instillFormat: "audio/*",
      title: "Audio",
    },
  };

  const hints = transformStartOperatorMetadataToSmartHints(metadata);

  expect(hints).toStrictEqual([
    {
      path: "start.text",
      key: "text",
      instillFormat: "string",
      type: "string",
    },
    {
      path: "start.audio",
      key: "audio",
      instillFormat: "audio/*",
      type: "string",
    },
  ]);
});

test("should transform start operator metadata to smart hints with empty metadata", () => {
  const hints = transformStartOperatorMetadataToSmartHints({});
  expect(hints).toStrictEqual([]);
});

test("should transform array metadata to smart hints", () => {
  const metadata: StartOperatorMetadata = {
    text: {
      type: "array",
      instillFormat: "array:string",
      items: {
        type: "string",
      },
      title: "Text",
    },
    images: {
      type: "array",
      instillFormat: "array:image/*",
      items: {
        type: "string",
      },
      title: "Images",
    },
  };

  const hints = transformStartOperatorMetadataToSmartHints(metadata);

  expect(hints).toStrictEqual([
    {
      path: "start.text",
      key: "text",
      instillFormat: "array:string",
      type: "array",
    },
    {
      path: "start.images",
      key: "images",
      instillFormat: "array:image/*",
      type: "array",
    },
  ]);
});
