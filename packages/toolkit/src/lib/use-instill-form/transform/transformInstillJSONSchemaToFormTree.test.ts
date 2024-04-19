import { test, expect } from "vitest";
import { transformInstillJSONSchemaToFormTree } from ".";
import { InstillFormTree, InstillJSONSchema } from "../types";

test("should transform basic JSON schema to formTree", () => {
  const schema: InstillJSONSchema = {
    title: "Simple JSON",
    type: "object",
    required: ["text", "model"],
    properties: {
      model: {
        type: "string",
        description:
          "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
        example: "text-embedding-ada-002",
        instillUIOrder: 0,
        instillFormat: "text",
        instillAcceptFormats: ["string", "text/*"],
        anyOf: [
          {
            type: "string",
            enum: ["text-embedding-ada-002"],
            instillUpstreamType: "value",
          },
          {
            type: "string",
            instillUpstreamType: "reference",
          },
        ],
        instillUpstreamTypes: ["value", "reference"],
        title: "Model",
      },
      text: {
        description: "",
        instillFormat: "text",
        instillCredentialField: true,
        instillUIOrder: 1,
        instillAcceptFormats: ["string", "text/*"],
        anyOf: [
          {
            type: "string",
            instillUpstreamType: "value",
          },
          {
            type: "string",
            instillUpstreamType: "reference",
          },
          {
            type: "string",
            instillUpstreamType: "template",
          },
        ],
        instillUpstreamTypes: ["value", "reference"],
        title: "Text",
      },
    },
  };

  const formTree = transformInstillJSONSchemaToFormTree(schema);

  const expectedFormTree: InstillFormTree = {
    title: "Simple JSON",
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
    jsonSchema: {
      title: "Simple JSON",
      type: "object",
      required: ["text", "model"],
      properties: {
        model: {
          type: "string",
          description:
            "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
          example: "text-embedding-ada-002",
          instillUIOrder: 0,
          instillFormat: "text",
          instillAcceptFormats: ["string", "text/*"],
          anyOf: [
            {
              type: "string",
              enum: ["text-embedding-ada-002"],
              instillUpstreamType: "value",
            },
            {
              type: "string",
              instillUpstreamType: "reference",
            },
          ],
          instillUpstreamTypes: ["value", "reference"],
          title: "Model",
        },
        text: {
          description: "",
          instillFormat: "text",
          instillCredentialField: true,
          instillUIOrder: 1,
          instillAcceptFormats: ["string", "text/*"],
          anyOf: [
            {
              type: "string",
              instillUpstreamType: "value",
            },
            {
              type: "string",
              instillUpstreamType: "reference",
            },
            {
              type: "string",
              instillUpstreamType: "template",
            },
          ],
          instillUpstreamTypes: ["value", "reference"],
          title: "Text",
        },
      },
    },
    properties: [
      {
        description:
          "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
        instillUpstreamTypes: ["value", "reference"],
        instillAcceptFormats: ["string", "text/*"],
        enum: ["text-embedding-ada-002"],
        example: undefined,
        examples: undefined,
        title: "Model",
        _type: "formItem",
        fieldKey: "model",
        path: "model",
        isRequired: true,
        type: "string",
        instillUIOrder: 0,
        isHidden: false,
        instillFormat: "text",
      },
      {
        description: "",
        instillUpstreamTypes: ["value", "reference"],
        instillAcceptFormats: ["string", "text/*"],
        title: "Text",
        _type: "formItem",
        fieldKey: "text",
        path: "text",
        isRequired: true,
        type: "string",
        instillUIOrder: 1,
        instillCredentialField: true,
        isHidden: false,
        instillFormat: "text",
      },
    ],
    isHidden: false,
  };

  expect(formTree).toStrictEqual(expectedFormTree);
});

test("should transform object in array JSON schema to formTree", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["ports"],
    properties: {
      ports: {
        type: "array",
        items: {
          properties: {
            port: {
              anyOf: [
                {
                  type: "integer",
                  instillUpstreamType: "value",
                },
              ],
              instillUpstreamTypes: ["value"],
              description: "Port of the database.",
              examples: [5432],
            },
          },
          type: "object",
        },
      },
    },
  };

  const formTree = transformInstillJSONSchemaToFormTree(schema);

  const expectedFormTree: InstillFormTree = {
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
    jsonSchema: {
      type: "object",
      required: ["ports"],
      properties: {
        ports: {
          type: "array",
          items: {
            properties: {
              port: {
                anyOf: [
                  {
                    type: "integer",
                    instillUpstreamType: "value",
                  },
                ],
                instillUpstreamTypes: ["value"],
                description: "Port of the database.",
                examples: [5432],
              },
            },
            type: "object",
          },
        },
      },
    },
    properties: [
      {
        properties: {
          _type: "formGroup",
          fieldKey: "ports",
          path: "ports",
          isRequired: false,
          isHidden: false,
          jsonSchema: {
            properties: {
              port: {
                anyOf: [
                  {
                    type: "integer",
                    instillUpstreamType: "value",
                  },
                ],
                instillUpstreamTypes: ["value"],
                description: "Port of the database.",
                examples: [5432],
              },
            },
            type: "object",
          },
          properties: [
            {
              instillUpstreamTypes: ["value"],
              instillAcceptFormats: [],
              description: "Port of the database.",
              examples: [5432],
              _type: "formItem",
              fieldKey: "port",
              path: "ports.port",
              isRequired: false,
              type: "integer",
              isHidden: false,
            },
          ],
        },
        jsonSchema: {
          type: "array",
          items: {
            properties: {
              port: {
                anyOf: [
                  {
                    type: "integer",
                    instillUpstreamType: "value",
                  },
                ],
                instillUpstreamTypes: ["value"],
                description: "Port of the database.",
                examples: [5432],
              },
            },
            type: "object",
          },
        },
        _type: "objectArray",
        fieldKey: "ports",
        path: "ports",
        isRequired: true,
      },
    ],
    isHidden: false,
  };

  expect(formTree).toStrictEqual(expectedFormTree);
});

test("should transform basic JSON schema without anyOf to formTree", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["host", "port", "user", "dbname"],
    properties: {
      host: { type: "string", description: "Hostname of the database." },
      port: {
        type: "integer",
        description: "Port of the database.",
      },
      user: {
        type: "string",
        description: "Username to use to access the database.",
      },
      dbname: { type: "string", description: "Name of the database." },
      password: {
        instillCredentialField: true,
        type: "string",
        description: "Password associated with the username.",
      },
    },
  };

  const expected: InstillFormTree = {
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
    jsonSchema: {
      type: "object",
      required: ["host", "port", "user", "dbname"],
      properties: {
        host: {
          type: "string",
          description: "Hostname of the database.",
        },
        port: {
          type: "integer",
          description: "Port of the database.",
        },
        user: {
          type: "string",
          description: "Username to use to access the database.",
        },
        dbname: {
          type: "string",
          description: "Name of the database.",
        },
        password: {
          instillCredentialField: true,
          type: "string",
          description: "Password associated with the username.",
        },
      },
    },
    properties: [
      {
        description: "Hostname of the database.",
        _type: "formItem",
        fieldKey: "host",
        path: "host",
        isRequired: true,
        type: "string",
        isHidden: false,
        instillAcceptFormats: [],
      },
      {
        description: "Port of the database.",
        _type: "formItem",
        fieldKey: "port",
        path: "port",
        isRequired: true,
        type: "integer",
        isHidden: false,
        instillAcceptFormats: [],
      },
      {
        description: "Username to use to access the database.",
        _type: "formItem",
        fieldKey: "user",
        path: "user",
        isRequired: true,
        type: "string",
        isHidden: false,
        instillAcceptFormats: [],
      },
      {
        description: "Name of the database.",
        _type: "formItem",
        fieldKey: "dbname",
        path: "dbname",
        isRequired: true,
        type: "string",
        isHidden: false,
        instillAcceptFormats: [],
      },
      {
        instillCredentialField: true,
        description: "Password associated with the username.",
        _type: "formItem",
        fieldKey: "password",
        path: "password",
        isRequired: false,
        type: "string",
        isHidden: false,
        instillAcceptFormats: [],
      },
    ],
    isHidden: false,
  };

  const formTree = transformInstillJSONSchemaToFormTree(schema);

  expect(formTree).toStrictEqual(expected);
});

test("should transform isHidden formTree", () => {
  const schema: InstillJSONSchema = {
    title: "Simple JSON",
    type: "object",
    required: ["text", "model"],
    properties: {
      model: {
        type: "string",
        description:
          "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
        example: "text-embedding-ada-002",
        instillUIOrder: 0,
        instillFormat: "text",
        anyOf: [
          {
            type: "string",
            enum: ["text-embedding-ada-002"],
            instillUpstreamType: "value",
          },
          {
            type: "string",
            instillUpstreamType: "reference",
          },
        ],
        instillUpstreamTypes: ["value", "reference"],
        title: "Model",
      },
      text: {
        description: "",
        instillFormat: "text",
        instillCredentialField: true,
        instillUIOrder: 1,
        anyOf: [
          {
            type: "string",
            instillUpstreamType: "value",
          },
          {
            type: "string",
            instillUpstreamType: "reference",
          },
          {
            type: "string",
            instillUpstreamType: "template",
          },
        ],
        instillUpstreamTypes: ["value", "reference"],
        title: "Text",
      },
    },
    instillEditOnNodeFields: ["model"],
  };

  const formTree = transformInstillJSONSchemaToFormTree(schema, {
    checkIsHidden: ({ parentSchema, targetKey }) => {
      if (!parentSchema) {
        return false;
      }

      if (!parentSchema.instillEditOnNodeFields) {
        return false;
      }

      if (!targetKey) {
        return false;
      }

      if (parentSchema.instillEditOnNodeFields.includes(targetKey)) {
        return false;
      }

      return true;
    },
  });

  const expectedFormTree: InstillFormTree = {
    title: "Simple JSON",
    _type: "formGroup",
    instillEditOnNodeFields: ["model"],
    fieldKey: null,
    path: null,
    isRequired: false,
    isHidden: false,
    jsonSchema: {
      title: "Simple JSON",
      type: "object",
      required: ["text", "model"],
      properties: {
        model: {
          type: "string",
          description:
            "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
          example: "text-embedding-ada-002",
          instillUIOrder: 0,
          instillFormat: "text",
          anyOf: [
            {
              type: "string",
              enum: ["text-embedding-ada-002"],
              instillUpstreamType: "value",
            },
            {
              type: "string",
              instillUpstreamType: "reference",
            },
          ],
          instillUpstreamTypes: ["value", "reference"],
          title: "Model",
        },
        text: {
          description: "",
          instillFormat: "text",
          instillCredentialField: true,
          instillUIOrder: 1,
          anyOf: [
            {
              type: "string",
              instillUpstreamType: "value",
            },
            {
              type: "string",
              instillUpstreamType: "reference",
            },
            {
              type: "string",
              instillUpstreamType: "template",
            },
          ],
          instillUpstreamTypes: ["value", "reference"],
          title: "Text",
        },
      },
      instillEditOnNodeFields: ["model"],
    },
    properties: [
      {
        description:
          "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
        instillUpstreamTypes: ["value", "reference"],
        enum: ["text-embedding-ada-002"],
        example: undefined,
        examples: undefined,
        title: "Model",
        _type: "formItem",
        fieldKey: "model",
        path: "model",
        isRequired: true,
        type: "string",
        instillUIOrder: 0,
        isHidden: false,
        instillFormat: "text",
        instillAcceptFormats: [],
      },
      {
        description: "",
        instillUpstreamTypes: ["value", "reference"],
        title: "Text",
        _type: "formItem",
        fieldKey: "text",
        path: "text",
        isRequired: true,
        type: "string",
        instillUIOrder: 1,
        instillCredentialField: true,
        isHidden: true,
        instillFormat: "text",
        instillAcceptFormats: [],
      },
    ],
  };

  expect(formTree).toStrictEqual(expectedFormTree);
});
