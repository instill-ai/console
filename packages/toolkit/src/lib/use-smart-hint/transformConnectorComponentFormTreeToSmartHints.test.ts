import { test, expect } from "vitest";
import { InstillFormTree } from "../use-instill-form";
import { transformConnectorComponentFormTreeToSmartHints } from "./transformConnectorComponentFormTreeToSmartHints";

test("should extract hints from formGroup", () => {
  const tree: InstillFormTree = {
    instillEditOnNodeFields: ["texts"],
    instillUIOrder: 0,
    title: "Output",
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
    jsonSchema: {
      instillEditOnNodeFields: ["texts"],
      instillUIOrder: 0,
      properties: {
        texts: {
          instillUIOrder: 0,
          items: {
            description: "",
            instillFormat: "text/plain",
            instillShortDescription: "",
            instillUIOrder: 0,
            title: "",
          },
          title: "Texts",
          type: "array",
        },
      },
      required: ["texts"],
      title: "Output",
      type: "object",
    },
    properties: [
      {
        description: "",
        instillFormat: "text/plain",
        instillShortDescription: "",
        instillUIOrder: 0,
        title: "Texts",
        _type: "formItem",
        fieldKey: "texts",
        path: "texts",
        isRequired: true,
        type: "array",
      },
    ],
  };

  const hints = transformConnectorComponentFormTreeToSmartHints(tree, "root");

  expect(hints).toStrictEqual([
    {
      path: "root.output.texts",
      key: "texts",
      instillFormat: "text/plain",
      type: "array",
      description: "",
    },
  ]);
});

test("should extract hints from objectArray", () => {
  const tree: InstillFormTree = {
    instillEditOnNodeFields: ["segments"],
    instillUIOrder: 0,
    title: "Output",
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
    jsonSchema: {
      instillEditOnNodeFields: ["segments"],
      instillUIOrder: 0,
      properties: {
        segments: {
          instillUIOrder: 0,
          items: {
            instillEditOnNodeFields: ["label", "mask", "score"],
            instillUIOrder: 0,
            properties: {
              label: {
                description:
                  "The label for the class (model specific) of a segment.",
                instillFormat: "string",
                instillShortDescription:
                  "The label for the class (model specific) of a segment.",
                instillUIOrder: 0,
                title: "Label",
              },
              mask: {
                description:
                  "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
                instillFormat: "image/jpeg",
                instillShortDescription:
                  "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
                instillUIOrder: 1,
                title: "Mask",
              },
              score: {
                description:
                  "A float that represents how likely it is that the segment belongs to the given class.",
                instillFormat: "number",
                instillShortDescription:
                  "A float that represents how likely it is that the segment belongs to the given class.",
                instillUIOrder: 2,
                title: "Score",
              },
            },
            required: ["label", "mask", "score"],
            type: "object",
          },
          title: "Segments",
          type: "array",
        },
      },
      required: ["segments"],
      title: "Output",
      type: "object",
    },
    properties: [
      {
        instillUIOrder: 0,
        title: "Segments",
        properties: {
          instillEditOnNodeFields: ["label", "mask", "score"],
          instillUIOrder: 0,
          _type: "formGroup",
          fieldKey: "segments",
          path: "segments",
          isRequired: false,
          jsonSchema: {
            instillEditOnNodeFields: ["label", "mask", "score"],
            instillUIOrder: 0,
            properties: {
              label: {
                description:
                  "The label for the class (model specific) of a segment.",
                instillFormat: "string",
                instillShortDescription:
                  "The label for the class (model specific) of a segment.",
                instillUIOrder: 0,
                title: "Label",
              },
              mask: {
                description:
                  "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
                instillFormat: "image/jpeg",
                instillShortDescription:
                  "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
                instillUIOrder: 1,
                title: "Mask",
              },
              score: {
                description:
                  "A float that represents how likely it is that the segment belongs to the given class.",
                instillFormat: "number",
                instillShortDescription:
                  "A float that represents how likely it is that the segment belongs to the given class.",
                instillUIOrder: 2,
                title: "Score",
              },
            },
            required: ["label", "mask", "score"],
            type: "object",
          },
          properties: [
            {
              description:
                "The label for the class (model specific) of a segment.",
              instillFormat: "string",
              instillShortDescription:
                "The label for the class (model specific) of a segment.",
              instillUIOrder: 0,
              title: "Label",
              _type: "formItem",
              fieldKey: "label",
              path: "segments.label",
              isRequired: true,
              type: "null",
              isHidden: false,
            },
            {
              description:
                "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
              instillFormat: "image/jpeg",
              instillShortDescription:
                "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
              instillUIOrder: 1,
              title: "Mask",
              _type: "formItem",
              fieldKey: "mask",
              path: "segments.mask",
              isRequired: true,
              type: "null",
              isHidden: false,
            },
            {
              description:
                "A float that represents how likely it is that the segment belongs to the given class.",
              instillFormat: "number",
              instillShortDescription:
                "A float that represents how likely it is that the segment belongs to the given class.",
              instillUIOrder: 2,
              title: "Score",
              _type: "formItem",
              fieldKey: "score",
              path: "segments.score",
              isRequired: true,
              type: "null",
              isHidden: false,
            },
          ],
        },
        jsonSchema: {
          instillUIOrder: 0,
          items: {
            instillEditOnNodeFields: ["label", "mask", "score"],
            instillUIOrder: 0,
            properties: {
              label: {
                description:
                  "The label for the class (model specific) of a segment.",
                instillFormat: "string",
                instillShortDescription:
                  "The label for the class (model specific) of a segment.",
                instillUIOrder: 0,
                title: "Label",
              },
              mask: {
                description:
                  "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
                instillFormat: "image/jpeg",
                instillShortDescription:
                  "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
                instillUIOrder: 1,
                title: "Mask",
              },
              score: {
                description:
                  "A float that represents how likely it is that the segment belongs to the given class.",
                instillFormat: "number",
                instillShortDescription:
                  "A float that represents how likely it is that the segment belongs to the given class.",
                instillUIOrder: 2,
                title: "Score",
              },
            },
            required: ["label", "mask", "score"],
            type: "object",
          },
          title: "Segments",
          type: "array",
        },
        _type: "objectArray",
        fieldKey: "segments",
        path: "segments",
        isRequired: true,
      },
    ],
  };

  const hints = transformConnectorComponentFormTreeToSmartHints(tree, "root");

  expect(hints).toStrictEqual([
    {
      path: "root.output.segments",
      key: "segments",
      instillFormat: "null",
      type: "array",
      properties: [
        {
          path: "root.output.segments.label",
          key: "label",
          instillFormat: "string",
          type: "null",
          description: "The label for the class (model specific) of a segment.",
        },
        {
          path: "root.output.segments.mask",
          key: "mask",
          instillFormat: "image/jpeg",
          type: "null",
          description:
            "A str (base64 str of a single channel black-and-white img) representing the mask of a segment.",
        },
        {
          path: "root.output.segments.score",
          key: "score",
          instillFormat: "number",
          type: "null",
          description:
            "A float that represents how likely it is that the segment belongs to the given class.",
        },
      ],
    },
  ]);
});
