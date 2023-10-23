import { test, expect } from "vitest";
import { InstillJSONSchema } from "../type";
import { transformInstillJSONSchemaToZod } from ".";

test("should transform basic json schema to zod schema", () => {
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
        credential_field: true,
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

test("should transform required field", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["host"],
    properties: {
      host: { type: "string", description: "Hostname of the database." },
      port: {
        type: "integer",
        description: "Port of the database.",
      },
    },
  };

  const testedObj = {
    host: "localhost",
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
    },
  });

  const wrongObj = {
    port: 4000,
  };

  const parsedWrongObj = zodSchema.safeParse(wrongObj);

  expect(parsedWrongObj.success).toBe(false);
});

test("should transform double nested required field", () => {
  const schema: InstillJSONSchema = {
    oneOf: [
      {
        required: ["task", "model"],
        properties: {
          task: {
            const: "TASK_TEXT_GENERATION",
          },
          model: {
            type: "string",
            enum: [
              "gpt-4",
              "gpt-4-0314",
              "gpt-4-0613",
              "gpt-4-32k",
              "gpt-4-32k-0314",
              "gpt-4-32k-0613",
              "gpt-3.5-turbo",
              "gpt-3.5-turbo-16k",
              "gpt-3.5-turbo-0301",
              "gpt-3.5-turbo-0613",
              "gpt-3.5-turbo-16k-0613",
            ],
          },
        },
        type: "object",
      },
      {
        required: ["task", "text"],
        properties: {
          task: {
            const: "TASK_TEXT_EMBEDDINGS",
          },
          text: {
            type: "string",
          },
        },
        type: "object",
      },
    ],
  };

  const testedObj = {
    model: "gpt-4",
    task: "TASK_TEXT_GENERATION",
  };

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: {
      task: "TASK_TEXT_GENERATION",
    },
  });

  const parsedObj = zodSchema.safeParse(testedObj);

  expect(parsedObj).toStrictEqual({
    success: true,
    data: {
      model: "gpt-4",
      task: "TASK_TEXT_GENERATION",
    },
  });

  const wrongObj = {
    text: "gpt-4",
    task: "TASK_TEXT_GENERATION",
  };

  const parsedWrongObj = zodSchema.safeParse(wrongObj);

  expect(parsedWrongObj.success).toBe(false);
});

test("should transform enum fields", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["host"],
    properties: {
      task: {
        title: "Task",
        enum: [
          "TASK_TEXT_GENERATION",
          "TASK_TEXT_EMBEDDINGS",
          "TASK_SPEECH_RECOGNITION",
        ],
        type: "string",
        default: "TASK_TEXT_GENERATION",
      },
    },
  };

  const testedObj = {
    task: "TASK_TEXT_GENERATION",
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
      task: "TASK_TEXT_GENERATION",
    },
  });

  const wrongObj = {
    task: "TASK_UNSPECIFIED",
  };

  const parsedWrongObj = zodSchema.safeParse(wrongObj);

  expect(parsedWrongObj.success).toBe(false);
});

test("should transform anyOf fields", () => {
  // Be careful, number/integer type in current implementation, their zod
  // schema is still string type.
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["model"],
    properties: {
      model: {
        description:
          "ID of the model to use. Only `whisper-1` is currently available.\n",
        anyOf: [
          {
            type: "string",
            enum: ["whisper-2"],
          },
          {
            type: "string",
            enum: ["whisper-1"],
          },
        ],
      },
    },
  };

  const firstTest = {
    model: "whisper-1",
  };

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: null,
  });

  const firstTestResult = zodSchema.safeParse(firstTest);

  expect(firstTestResult).toStrictEqual({
    success: true,
    data: { model: "whisper-1" },
  });

  const secondTest = {
    model: "123",
  };

  const secondTestResult = zodSchema.safeParse(secondTest);

  expect(secondTestResult.success).toBe(false);
});

test("should transform oneOf fields", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["protocol"],
    oneOf: [
      {
        properties: {
          protocol: {
            const: "http",
            title: "Protocol",
          },
          host: {
            type: "string",
          },
          port: {
            type: "integer",
          },
          foo: {
            type: "string",
          },
        },
      },
      {
        properties: {
          protocol: {
            const: "https",
            title: "Protocol",
          },
          host: {
            type: "string",
          },
          port: {
            type: "integer",
          },
          bar: {
            type: "string",
          },
        },
      },
    ],
  };

  const testedObj = {
    host: "localhost",
    port: "8080",
    protocol: "http",
    foo: "yes",
  };

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: {
      protocol: "http",
    },
  });

  const parsedObj = zodSchema.safeParse(testedObj);

  expect(parsedObj).toStrictEqual({
    success: true,
    data: {
      host: "localhost",
      port: "8080",
      protocol: "http",
      foo: "yes",
    },
  });

  const wrongObj = {
    host: "localhost",
    port: "8080",
    protocol: "https",
    foo: "yes",
  };

  const parsedWrongObj = zodSchema.safeParse(wrongObj);

  expect(parsedWrongObj.success).toBe(false);
});

test("should transform nested oneOf fields", () => {
  const schema: InstillJSONSchema = {
    type: "object",
    required: ["protocol"],
    oneOf: [
      {
        properties: {
          protocol: {
            const: "http",
            title: "Protocol",
          },
          host: {
            type: "string",
          },
          port: {
            type: "integer",
          },
          foo: {
            type: "string",
          },
        },
      },
      {
        required: ["protocol", "tunnel_method"],
        properties: {
          protocol: {
            const: "https",
            title: "Protocol",
          },
          host: {
            type: "string",
          },
          port: {
            type: "integer",
          },
          bar: {
            type: "string",
          },
          tunnel_method: {
            description:
              "Whether to initiate an SSH tunnel before connecting to the database, and if so, which kind of authentication to use.",
            oneOf: [
              {
                properties: {
                  tunnel_method: {
                    const: "NO_TUNNEL",
                    description: "No ssh tunnel needed to connect to database",
                    type: "string",
                  },
                },
                required: ["tunnel_method"],
                title: "No Tunnel",
              },
              {
                properties: {
                  ssh_key: {
                    description:
                      "OS-level user account ssh key credentials in RSA PEM format ( created with ssh-keygen -t rsa -m PEM -f myuser_rsa )",
                    title: "SSH Private Key",
                    type: "string",
                  },
                  tunnel_host: {
                    description:
                      "Hostname of the jump server host that allows inbound ssh tunnel.",
                    title: "SSH Tunnel Jump Server Host",
                    type: "string",
                  },
                  tunnel_method: {
                    const: "SSH_KEY_AUTH",
                    description:
                      "Connect through a jump server tunnel host using username and ssh key",
                    type: "string",
                  },
                  tunnel_port: {
                    default: 22,
                    description:
                      "Port on the proxy/jump server that accepts inbound ssh connections.",
                    examples: ["22"],
                    maximum: 65536,
                    minimum: 0,
                    title: "SSH Connection Port",
                    type: "integer",
                  },
                  tunnel_user: {
                    description:
                      "OS-level username for logging into the jump server host.",
                    title: "SSH Login Username",
                    type: "string",
                  },
                },
                required: [
                  "tunnel_method",
                  "tunnel_host",
                  "tunnel_port",
                  "tunnel_user",
                  "ssh_key",
                ],
                title: "SSH Key Authentication",
              },
              {
                properties: {
                  tunnel_host: {
                    description:
                      "Hostname of the jump server host that allows inbound ssh tunnel.",
                    title: "SSH Tunnel Jump Server Host",
                    type: "string",
                  },
                  tunnel_method: {
                    const: "SSH_PASSWORD_AUTH",
                    description:
                      "Connect through a jump server tunnel host using username and password authentication",
                    type: "string",
                  },
                  tunnel_port: {
                    default: 22,
                    description:
                      "Port on the proxy/jump server that accepts inbound ssh connections.",
                    examples: ["22"],
                    maximum: 65536,
                    minimum: 0,
                    title: "SSH Connection Port",
                    type: "integer",
                  },
                  tunnel_user: {
                    description:
                      "OS-level username for logging into the jump server host",
                    title: "SSH Login Username",
                    type: "string",
                  },
                  tunnel_user_password: {
                    description:
                      "OS-level password for logging into the jump server host",
                    title: "Password",
                    type: "string",
                  },
                },
                required: [
                  "tunnel_method",
                  "tunnel_host",
                  "tunnel_port",
                  "tunnel_user",
                  "tunnel_user_password",
                ],
                title: "Password Authentication",
              },
            ],
            title: "SSH Tunnel Method",
            type: "object",
          },
        },
      },
    ],
  };

  const testedObj = {
    host: "localhost",
    port: "8080",
    protocol: "https",
    bar: "yes",
    tunnel_method: {
      tunnel_method: "NO_TUNNEL",
    },
  };

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: {
      protocol: "https",
      "tunnel_method.tunnel_method": "NO_TUNNEL",
    },
  });

  const parsedObj = zodSchema.safeParse(testedObj);

  expect(parsedObj).toStrictEqual({
    success: true,
    data: {
      host: "localhost",
      port: "8080",
      protocol: "https",
      bar: "yes",
      tunnel_method: {
        tunnel_method: "NO_TUNNEL",
      },
    },
  });
});

test("should transform realworld InstillJSONSchema to zod schema", () => {
  const schema: InstillJSONSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    oneOf: [
      {
        properties: {
          input: {
            properties: {
              max_tokens: {
                type: "integer",
                description:
                  "The maximum number of [tokens](/tokenizer) to generate in the chat completion.\n\nThe total length of input tokens and generated tokens is limited by the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.\n",
                instillFormat: "integer",
                instillUpstreamTypes: ["value", "reference"],
                title: "Max Tokens",
              },
              model: {
                type: "string",
                enum: [
                  "gpt-4",
                  "gpt-4-0314",
                  "gpt-4-0613",
                  "gpt-4-32k",
                  "gpt-4-32k-0314",
                  "gpt-4-32k-0613",
                  "gpt-3.5-turbo",
                  "gpt-3.5-turbo-16k",
                  "gpt-3.5-turbo-0301",
                  "gpt-3.5-turbo-0613",
                  "gpt-3.5-turbo-16k-0613",
                ],
                description:
                  "ID of the model to use. See the [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.",
                example: "gpt-3.5-turbo",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Model",
                "x-oaiTypeLabel": "string",
              },
              n: {
                default: 1,
                example: 1,
                instillUpstreamType: "value",
                maximum: 128,
                minimum: 1,
                nullable: true,
                type: "integer",
                description:
                  "How many chat completion choices to generate for each input message.",
                instillFormat: "integer",
                instillUpstreamTypes: ["value", "reference"],
                title: "N",
              },
              prompt: {
                type: "string",
                description: "",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Prompt",
              },
              system_message: {
                maxLength: 2048,
                type: "string",
                default: "You are a helpful assistant.",
                description:
                  'The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation. By default, the model’s behavior is using a generic message as "You are a helpful assistant."',
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "System message",
              },
              temperature: {
                default: 1,
                example: 1,
                instillUpstreamType: "value",
                maximum: 2,
                minimum: 0,
                nullable: true,
                type: "number",
                description:
                  "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n\nWe generally recommend altering this or `top_p` but not both.\n",
                instillFormat: "number",
                instillUpstreamTypes: ["value", "reference"],
                title: "Temperature",
              },
            },
            required: ["model", "prompt"],
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
              model: {
                type: "string",
                enum: ["text-embedding-ada-002"],
                description:
                  "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
                example: "text-embedding-ada-002",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Model",
                "x-oaiTypeLabel": "string",
              },
              text: {
                type: "string",
                description: "",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Text",
              },
            },
            required: ["text", "model"],
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
                type: "string",
                description:
                  "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                instillFormat: "audio",
                instillUpstreamTypes: ["reference"],
                title: "Audio",
              },
              language: {
                type: "string",
                description:
                  "The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.\n",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Language",
              },
              model: {
                enum: ["whisper-1"],
                type: "string",
                description:
                  "ID of the model to use. Only `whisper-1` is currently available.\n",
                example: "whisper-1",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Model",
                "x-oaiTypeLabel": "string",
              },
              prompt: {
                type: "string",
                description:
                  "An optional text to guide the model's style or continue a previous audio segment. The [prompt](https://platform.openai.com/docs/guides/speech-to-text/prompting) should match the audio language.\n",
                instillFormat: "text",
                instillUpstreamTypes: ["value", "reference"],
                title: "Prompt",
              },
              temperature: {
                type: "number",
                description:
                  "The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.\n",
                instillFormat: "number",
                instillUpstreamTypes: ["value", "reference"],
                title: "Temperature",
              },
            },
            required: ["audio", "model"],
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

  const zodSchema = transformInstillJSONSchemaToZod({
    parentSchema: schema,
    targetSchema: schema,
    selectedConditionMap: null,
  });

  const testedObj = {
    input: {
      model: "gpt-4",
      prompt: "hello",
    },
    task: "TASK_TEXT_GENERATION",
  };

  const parsedObj = zodSchema.safeParse(testedObj);

  expect(parsedObj).toStrictEqual({
    success: true,
    data: {
      input: {
        model: "gpt-4",
        prompt: "hello",
      },
      task: "TASK_TEXT_GENERATION",
    },
  });
});
