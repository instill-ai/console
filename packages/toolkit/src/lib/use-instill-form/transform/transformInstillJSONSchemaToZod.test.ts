import { test, expect } from "vitest";
import { InstillJSONSchema } from "../types";
import { transformInstillJSONSchemaToZod } from ".";

test("should transform basic json schema to zod schema", () => {
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

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: null,
  });

  const primitiveText = {
    text: "foo",
    model: "text-embedding-ada-002",
  };

  expect(zodSchema.safeParse(primitiveText)).toStrictEqual({
    success: true,
    data: {
      text: "foo",
      model: "text-embedding-ada-002",
    },
  });

  const outOfEnumModel = {
    text: "foo",
    model: "text-embedding-ada-003",
  };

  expect(zodSchema.safeParse(outOfEnumModel).success).toBe(false);

  const emptyString = {
    text: "",
    model: "text-embedding-ada-002",
  };

  expect(zodSchema.safeParse(emptyString).success).toBe(false);
});

test("should transform anyOf field to zod schema", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["host", "port"],
    properties: {
      host: {
        type: "string",
        description: "Hostname of the database.",
        anyOf: [
          { type: "string", instillUpstreamType: "value" },
          { type: "string", instillUpstreamType: "reference" },
          { type: "string", instillUpstreamType: "template" },
        ],
        instillUpstreamTypes: ["value", "template"],
      },
      port: {
        description: "Port of the database.",
        anyOf: [
          { type: "integer", instillUpstreamType: "value" },
          {
            type: "string",
            instillUpstreamType: "reference",
          },
        ],
        instillUpstreamTypes: ["value", "reference"],
      },
    },
  };

  const templateHost = {
    host: "${ start.host } ${start.host}",
    port: "4433",
  };

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: null,
  });

  expect(zodSchema.safeParse(templateHost)).toStrictEqual({
    success: true,
    data: {
      host: "${ start.host } ${start.host}",
      port: "4433",
    },
  });

  const referencePort = {
    host: "localhost",
    port: "${ start.port }",
  };

  expect(zodSchema.safeParse(referencePort)).toStrictEqual({
    success: true,
    data: {
      host: "localhost",
      port: "${ start.port }",
    },
  });

  const numberPort = {
    host: "localhost",
    port: "3000",
  };

  expect(zodSchema.safeParse(numberPort)).toStrictEqual({
    success: true,
    data: {
      host: "localhost",
      port: "3000",
    },
  });

  const nonNumberPort = {
    host: "localhost",
    port: "3000foo",
  };

  expect(zodSchema.safeParse(nonNumberPort).success).toBe(false);

  const templatePort = {
    host: "localhost",
    port: "{{ state.port }}",
  };

  expect(zodSchema.safeParse(templatePort).success).toBe(false);
});

test("should transform nested fields with anyOf", () => {
  const schema: InstillJSONSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    oneOf: [
      {
        properties: {
          input: {
            oneOf: [
              {
                properties: {
                  model: {
                    const: "MODEL_DAVINCI",
                  },
                  prompt: {
                    type: "string",
                  },
                },
                required: ["prompt", "model"],
              },
              {
                properties: {
                  model: {
                    const: "MODEL_GPT4",
                  },
                  system_message: {
                    type: "string",
                  },
                },
                required: ["system_message", "model"],
              },
            ],
            type: "object",
          },
          metadata: {
            title: "Metadata",
            type: "object",
          },
          task: {
            const: "TASK_TEXT_GENERATION",
          },
        },
        type: "object",
        required: ["input"],
      },
      {
        properties: {
          input: {
            properties: {
              text: {
                description: "",
                instillFormat: "text",
                anyOf: [
                  { type: "string", instillUpstreamType: "value" },
                  { type: "string", instillUpstreamType: "template" },
                  { type: "string", instillUpstreamType: "reference" },
                ],
                instillUpstreamTypes: ["value", "reference"],
                title: "Text",
              },
            },
            required: ["text"],
            type: "object",
          },
          metadata: {
            title: "Metadata",
            type: "object",
          },
          task: {
            const: "TASK_TEXT_EMBEDDINGS",
          },
        },
        type: "object",
        required: ["input"],
      },
      {
        properties: {
          input: {
            properties: {
              audio: {
                description:
                  "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                instillFormat: "audio",
                anyOf: [{ type: "string", instillUpstreamType: "reference" }],
                instillUpstreamTypes: ["reference"],
                title: "Audio",
              },
            },
            required: ["audio"],
            type: "object",
          },
          metadata: {
            title: "Metadata",
            type: "object",
          },
          task: {
            const: "TASK_SPEECH_RECOGNITION",
          },
        },
        type: "object",
        required: ["input"],
      },
    ],
    title: "OpenAI Component",
    type: "object",
  };

  const embeddingZodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: {
      task: "TASK_TEXT_EMBEDDINGS",
    },
  });

  const templateText = {
    task: "TASK_TEXT_EMBEDDINGS",
    input: {
      text: "${ start.text } and ${ start.text }",
    },
  };

  expect(embeddingZodSchema.safeParse(templateText)).toStrictEqual({
    success: true,
    data: {
      task: "TASK_TEXT_EMBEDDINGS",
      input: {
        text: "${ start.text } and ${ start.text }",
      },
    },
  });

  const referenceText = {
    task: "TASK_TEXT_EMBEDDINGS",
    input: {
      text: "${ start.text }",
    },
  };

  expect(embeddingZodSchema.safeParse(referenceText)).toStrictEqual({
    success: true,
    data: {
      task: "TASK_TEXT_EMBEDDINGS",
      input: {
        text: "${ start.text }",
      },
    },
  });

  const speechZodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: {
      task: "TASK_SPEECH_RECOGNITION",
    },
  });

  const referenceAudio = {
    task: "TASK_SPEECH_RECOGNITION",
    input: {
      audio: "${ start.audio }",
    },
  };

  expect(speechZodSchema.safeParse(referenceAudio)).toStrictEqual({
    success: true,
    data: {
      task: "TASK_SPEECH_RECOGNITION",
      input: {
        audio: "${ start.audio }",
      },
    },
  });

  const templateAudio = {
    task: "TASK_SPEECH_RECOGNITION",
    input: {
      audio: "${ start.audio } and ${ start.audio }",
    },
  };

  expect(speechZodSchema.safeParse(templateAudio).success).toBe(true);

  const stringAudio = {
    task: "TASK_SPEECH_RECOGNITION",
    input: {
      audio: "foo",
    },
  };

  expect(speechZodSchema.safeParse(stringAudio).success).toBe(false);
});

test("should transform fields without anyOf", () => {
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

  const testedObj = {
    host: "localhost",
    port: "5432",
    user: "foo",
    dbname: "postgres-test",
    password: "bar",
  };

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: null,
  });

  const parsedObj = zodSchema.safeParse(testedObj);

  expect(parsedObj).toStrictEqual({
    success: true,
    data: {
      host: "localhost",
      port: "5432",
      user: "foo",
      dbname: "postgres-test",
      password: "bar",
    },
  });
});

test("should transform isHidden", () => {
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

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: null,
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

  const testedObj = {
    model: "text-embedding-ada-002",
    test: "foo",
  };

  const parsedObj = zodSchema.safeParse(testedObj);

  expect(parsedObj).toStrictEqual({
    success: true,
    data: {
      model: "text-embedding-ada-002",
    },
  });
});
