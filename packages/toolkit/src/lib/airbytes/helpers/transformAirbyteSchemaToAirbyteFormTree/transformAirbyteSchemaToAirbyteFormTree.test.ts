/**
 * This is the test comes from airbyte, it is very suitable for the documentation of the method: airbyteSchemaToAirbyteFormTree
 * ref: https://github.com/airbytehq/airbyte/blob/29ce34f1cee4878a6e9368890d87820c0d379844/airbyte-webapp/src/core/jsonSchema/schemaToUiWidget.test.ts
 */

import { test, expect } from "vitest";
import { transformAirbyteSchemaToAirbyteFormTree } from "./transformAirbyteSchemaToAirbyteFormTree";
import { AirbyteJsonSchemaDefinition } from "../../types";

test("should reformat jsonSchema to formTree representation", () => {
  const schema: AirbyteJsonSchemaDefinition = {
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
        credential_field: true,
        type: "string",
        description: "Password associated with the username.",
      },
    },
  };

  const formTree = transformAirbyteSchemaToAirbyteFormTree(schema, "key");

  const expected = {
    _type: "formGroup",
    path: "key",
    fieldKey: "key",
    hasOauth: undefined,
    isRequired: false,
    jsonSchema: {
      properties: {
        dbname: {
          description: "Name of the database.",
          type: "string",
        },
        host: {
          description: "Hostname of the database.",
          type: "string",
        },
        password: {
          credential_field: true,
          description: "Password associated with the username.",
          type: "string",
        },
        port: {
          description: "Port of the database.",
          type: "integer",
        },
        user: {
          description: "Username to use to access the database.",
          type: "string",
        },
      },
      required: ["host", "port", "user", "dbname"],
      type: "object",
    },
    properties: [
      {
        _type: "formItem",
        description: "Hostname of the database.",
        path: "key.host",
        fieldKey: "host",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
      {
        _type: "formItem",
        description: "Port of the database.",
        path: "key.port",
        fieldKey: "port",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "integer",
      },
      {
        _type: "formItem",
        description: "Username to use to access the database.",
        path: "key.user",
        fieldKey: "user",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
      {
        _type: "formItem",
        description: "Name of the database.",
        path: "key.dbname",
        fieldKey: "dbname",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
      {
        _type: "formItem",
        description: "Password associated with the username.",
        path: "key.password",
        fieldKey: "password",
        isRequired: false,
        isSecret: true,
        multiline: false,
        type: "string",
      },
    ],
  };

  expect(formTree).toStrictEqual(expected);
});

test("should reformat jsonSchema to formTree representation with parent schema", () => {
  const schema: AirbyteJsonSchemaDefinition = {
    type: "object",
    title: "Postgres Source Spec",
    required: ["host", "port", "user", "dbname"],
    properties: {
      host: { type: "string", description: "Hostname of the database." },
    },
  };

  const formTree = transformAirbyteSchemaToAirbyteFormTree(
    schema,
    "key",
    undefined,
    {
      required: ["key"],
    }
  );

  const expected = {
    _type: "formGroup",
    fieldKey: "key",
    path: "key",
    hasOauth: undefined,
    isRequired: true,
    jsonSchema: {
      properties: {
        host: {
          description: "Hostname of the database.",
          type: "string",
        },
      },
      required: ["host", "port", "user", "dbname"],
      title: "Postgres Source Spec",
      type: "object",
    },
    properties: [
      {
        _type: "formItem",
        description: "Hostname of the database.",
        fieldKey: "host",
        path: "key.host",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
    ],
    title: "Postgres Source Spec",
  };

  expect(formTree).toStrictEqual(expected);
});

test("should reformat jsonSchema to formTree representation when has oneOf", () => {
  const schema: AirbyteJsonSchemaDefinition = {
    type: "object",
    required: ["start_date", "credentials"],
    properties: {
      start_date: {
        type: "string",
      },
      credentials: {
        type: "object",
        title: "Credentials Condition",
        description: "Credentials Condition Description",
        order: 0,
        oneOf: [
          {
            title: "api key",
            required: ["api_key"],
            properties: {
              api_key: {
                type: "string",
              },
              type: {
                type: "string",
                const: "api",
                default: "api",
              },
            },
          },
          {
            title: "oauth",
            required: ["redirect_uri"],
            properties: {
              redirect_uri: {
                type: "string",
                examples: ["https://api.hubspot.com/"],
              },
              type: {
                type: "string",
                const: "oauth",
                default: "oauth",
              },
            },
          },
        ],
      },
    },
  };

  const formTree = transformAirbyteSchemaToAirbyteFormTree(
    schema,
    "key",
    undefined,
    {
      required: ["key"],
    }
  );

  const expected = {
    _type: "formGroup",
    hasOauth: undefined,
    jsonSchema: {
      type: "object",
      required: ["start_date", "credentials"],
      properties: {
        start_date: { type: "string" },
        credentials: {
          type: "object",
          title: "Credentials Condition",
          description: "Credentials Condition Description",
          order: 0,
          oneOf: [
            {
              title: "api key",
              required: ["api_key"],
              properties: {
                api_key: { type: "string" },
                type: { type: "string", const: "api", default: "api" },
              },
            },
            {
              title: "oauth",
              required: ["redirect_uri"],
              properties: {
                redirect_uri: {
                  type: "string",
                  examples: ["https://api.hubspot.com/"],
                },
                type: { type: "string", const: "oauth", default: "oauth" },
              },
            },
          ],
        },
      },
    },
    path: "key",
    fieldKey: "key",
    properties: [
      {
        title: "Credentials Condition",
        description: "Credentials Condition Description",
        order: 0,
        _type: "formCondition",
        path: "key.credentials",
        fieldKey: "credentials",
        conditions: {
          "api key": {
            title: "api key",
            hasOauth: undefined,
            _type: "formGroup",
            jsonSchema: {
              title: "api key",
              required: ["api_key"],
              properties: {
                api_key: { type: "string" },
                type: { type: "string", const: "api", default: "api" },
              },
              type: "object",
            },
            path: "key.credentials",
            fieldKey: "credentials",
            properties: [
              {
                _type: "formItem",
                path: "key.credentials.api_key",
                fieldKey: "api_key",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                const: "api",
                default: "api",
                _type: "formItem",
                path: "key.credentials.type",
                fieldKey: "type",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
          oauth: {
            title: "oauth",
            _type: "formGroup",
            hasOauth: undefined,
            jsonSchema: {
              title: "oauth",
              required: ["redirect_uri"],
              properties: {
                redirect_uri: {
                  type: "string",
                  examples: ["https://api.hubspot.com/"],
                },
                type: { type: "string", const: "oauth", default: "oauth" },
              },
              type: "object",
            },
            path: "key.credentials",
            fieldKey: "credentials",
            properties: [
              {
                examples: ["https://api.hubspot.com/"],
                _type: "formItem",
                path: "key.credentials.redirect_uri",
                fieldKey: "redirect_uri",
                isRequired: true,
                isSecret: false,
                multiline: false,
                type: "string",
              },
              {
                const: "oauth",
                default: "oauth",
                _type: "formItem",
                path: "key.credentials.type",
                fieldKey: "type",
                isRequired: false,
                isSecret: false,
                multiline: false,
                type: "string",
              },
            ],
            isRequired: false,
          },
        },
        isRequired: true,
      },
      {
        _type: "formItem",
        path: "key.start_date",
        fieldKey: "start_date",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
    ],
    isRequired: true,
  };

  expect(formTree).toStrictEqual(expected);
});
