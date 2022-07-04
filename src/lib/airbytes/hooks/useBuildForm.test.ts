import { AirbyteFormTree } from "../types";

test("should render FormCondition to UI component", () => {
  const formTree: AirbyteFormTree = {
    _type: "formGroup",
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
              properties: { api_key: { type: "string" } },
            },
            {
              title: "oauth",
              required: ["redirect_uri"],
              properties: {
                redirect_uri: {
                  type: "string",
                  examples: ["https://api.hubspot.com/"],
                },
              },
            },
          ],
        },
      },
    },
    path: "key",
    fieldKey: "key",
    hasOauth: undefined,
    properties: [
      {
        _type: "formItem",
        path: "key.start_date",
        fieldKey: "start_date",
        isRequired: true,
        isSecret: false,
        multiline: false,
        type: "string",
      },
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
            _type: "formGroup",
            jsonSchema: {
              title: "api key",
              required: ["api_key"],
              properties: { api_key: { type: "string" } },
              type: "object",
            },
            path: "key.credentials",
            fieldKey: "credentials",
            hasOauth: undefined,
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
            ],
            isRequired: false,
          },
          oauth: {
            title: "oauth",
            _type: "formGroup",
            jsonSchema: {
              title: "oauth",
              required: ["redirect_uri"],
              properties: {
                redirect_uri: {
                  type: "string",
                  examples: ["https://api.hubspot.com/"],
                },
              },
              type: "object",
            },
            path: "key.credentials",
            fieldKey: "credentials",
            hasOauth: undefined,
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
            ],
            isRequired: false,
          },
        },
        isRequired: true,
      },
    ],
    isRequired: true,
  };
});
