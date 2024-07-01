export const InstillYamlSchema = {
  $id: "http://json-schema.org/draft-06/schema#",
  type: "object",
  properties: {
    version: {
      type: "string",
    },
    on: {
      type: "object",
    },
    variable: {
      type: "object",
      patternProperties: {
        "^[a-z][-a-z0-9]{0,31}$": {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            "instill-ui-multiline": {
              type: "boolean",
            },
            "instill-ui-order": {
              type: "integer",
            },
            "instill-format": {
              type: "string",
            },
          },
          required: ["instill-format"],
        },
      },
    },
    secret: {
      type: "object",
      patternProperties: {
        "^[a-z][-a-z0-9]{0,31}$": {
          type: "string",
        },
      },
    },
    output: {
      type: "object",
      patternProperties: {
        "^[a-z][-a-z0-9]{0,31}$": {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            "instill-ui-multiline": {
              type: "boolean",
            },
            "instill-ui-order": {
              type: "integer",
            },
            value: {
              type: "string",
            },
          },
          required: ["value"],
        },
      },
    },
    component: {
      type: "object",
      additionalProperties: false,
      patternProperties: {
        "^[a-z][-a-z0-9]{0,31}$": {
          type: "object",
          description: "The ID of the component, must in kebab-case",
          properties: {
            type: {
              type: "string",
              description: "Please specify the component type",
              enum: ["openai", "base64", "iterator", "json"],
            },
            task: {
              type: "string",
              description: "Please specify the component task",
            },
          },
          required: ["type", "task"],
        },
      },
    },
  },
};
