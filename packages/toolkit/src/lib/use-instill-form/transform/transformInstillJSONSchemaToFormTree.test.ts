import { transformInstillJSONSchemaToFormTree } from ".";
import { InstillFormTree, InstillJSONSchema } from "../type";
import { test, expect } from "vitest";

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
        enum: ["text-embedding-ada-002"],
        example: undefined,
        examples: undefined,
        title: "Model",
        _type: "formItem",
        fieldKey: "model",
        path: "model",
        isRequired: true,
        type: "string",
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
      },
    ],
  };

  expect(formTree).toStrictEqual(expectedFormTree);
});

test("should transform formArray JSON schema to formTree", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["host", "ports"],
    properties: {
      host: {
        anyOf: [
          {
            type: "string",
            instillUpstreamType: "value",
          },
        ],
        instillUpstreamTypes: ["value"],
        description: "Hostname of the database.",
        example: "hello-world",
      },
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
      required: ["host", "ports"],
      properties: {
        host: {
          anyOf: [
            {
              type: "string",
              instillUpstreamType: "value",
            },
          ],
          instillUpstreamTypes: ["value"],
          description: "Hostname of the database.",
          example: "hello-world",
        },
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
        instillUpstreamTypes: ["value"],
        description: "Hostname of the database.",
        example: "hello-world",
        _type: "formItem",
        fieldKey: "host",
        path: "host",
        isRequired: true,
        type: "string",
      },
      {
        _type: "formArray",
        fieldKey: "ports",
        path: "ports",
        isRequired: true,
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
            description: "Port of the database.",
            examples: [5432],
            _type: "formItem",
            fieldKey: "port",
            path: "ports.port",
            isRequired: false,
            type: "integer",
          },
        ],
      },
    ],
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
      },
      {
        description: "Port of the database.",
        _type: "formItem",
        fieldKey: "port",
        path: "port",
        isRequired: true,
        type: "integer",
      },
      {
        description: "Username to use to access the database.",
        _type: "formItem",
        fieldKey: "user",
        path: "user",
        isRequired: true,
        type: "string",
      },
      {
        description: "Name of the database.",
        _type: "formItem",
        fieldKey: "dbname",
        path: "dbname",
        isRequired: true,
        type: "string",
      },
      {
        instillCredentialField: true,
        description: "Password associated with the username.",
        _type: "formItem",
        fieldKey: "password",
        path: "password",
        isRequired: false,
        type: "string",
      },
    ],
  };

  const formTree = transformInstillJSONSchemaToFormTree(schema);

  expect(formTree).toStrictEqual(expected);
});
