const operatorDefinitionIds = [
  "base64",
  "json",
  "image",
  "text",
  "document",
  "audio",
  "video",
  "web",
];

const connectorDefinitionIds = [
  "http",
  "stability-ai",
  "instill-model",
  "hugging-face",
  "openai",
  "anthropic",
  "mistral-ai",
  "cohere",
  "fireworks-ai",
  "groq",
  "ollama",
  "github",
  "numbers",
  "google-search",
  "slack",
  "email",
  "jira",
  "hubspot",
  "whatsapp",
  "bigquery",
  "gcs",
  "pinecone",
  "redis",
  "elasticsearch",
  "mongodb",
  "sql",
  "weaviate",
  "qdrant",
  "instill-artifact",
  "freshdesk",
  "asana",
  "chroma",
  "collection",
  "universal-ai",
  "instill-app",
  "google-drive",
  "google-sheets",
  "perplexity-ai",
  "leadiq",
  "smartlead",
  "scheduler",
];

export const InstillYamlSchema = {
  $id: "http://json-schema.org/draft-06/schema#",
  type: "object",
  properties: {
    version: {
      type: "string",
    },
    on: {
      type: "object",
      patternProperties: {
        "^[a-z][-a-z0-9]{0,31}$": {
          type: "object",
          properties: {
            type: {
              type: "string",
            },
            event: {
              type: "string",
            },
          },
          additionalProperties: true,
          required: ["type", "event"],
        },
      },
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
            default: {},
            "instill-ui-multiline": {
              type: "boolean",
            },
            "instill-ui-order": {
              type: "integer",
            },
            format: {
              type: "string",
            },
            listen: {
              type: "array",
              items: { type: "string" },
            },
            required: {
              type: "boolean",
            },
          },
          additionalProperties: false,
          required: ["format"],
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
          additionalProperties: false,
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
              enum: [
                ...operatorDefinitionIds,
                ...connectorDefinitionIds,
                "iterator",
              ],
            },
            task: {
              type: "string",
              description: "Please specify the component task",
            },
          },
          if: {
            properties: {
              type: {
                const: "iterator",
              },
            },
            required: ["type"],
          },
          else: {
            required: ["type", "task"],
          },
        },
      },
    },
  },
};
