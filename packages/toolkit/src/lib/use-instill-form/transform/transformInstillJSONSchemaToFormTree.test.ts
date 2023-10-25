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

  const formTree = transformInstillJSONSchemaToFormTree({
    targetSchema: schema,
  });

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
        example: "text-embedding-ada-002",
        instillUpstreamTypes: ["value", "reference"],
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

test("should transform real InstillJSONSchema to formTree", () => {
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

  const formTree = transformInstillJSONSchemaToFormTree({
    targetSchema: schema,
  });

  const expectedFormTree: InstillFormTree = {
    title: "OpenAI Component",
    _type: "formCondition",
    fieldKey: null,
    path: null,
    conditions: {
      TASK_TEXT_GENERATION: {
        _type: "formGroup",
        fieldKey: null,
        path: null,
        isRequired: false,
        jsonSchema: {
          type: "object",
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
          required: ["input"],
        },
        properties: [
          {
            _type: "formGroup",
            fieldKey: "input",
            path: "input",
            isRequired: true,
            jsonSchema: {
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
            properties: [
              {
                description:
                  "The maximum number of [tokens](/tokenizer) to generate in the chat completion.\n\nThe total length of input tokens and generated tokens is limited by the model's context length. [Example Python code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) for counting tokens.\n",
                title: "Max Tokens",
                _type: "formItem",
                fieldKey: "max_tokens",
                path: "input.max_tokens",
                isRequired: false,
                type: "integer",
              },
              {
                description:
                  "ID of the model to use. See the [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.",
                example: "gpt-3.5-turbo",
                title: "Model",
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
                _type: "formItem",
                fieldKey: "model",
                path: "input.model",
                isRequired: true,
                type: "string",
              },
              {
                default: 1,
                example: 1,
                description:
                  "How many chat completion choices to generate for each input message.",
                title: "N",
                _type: "formItem",
                fieldKey: "n",
                path: "input.n",
                isRequired: false,
                type: "integer",
              },
              {
                description: "",
                title: "Prompt",
                _type: "formItem",
                fieldKey: "prompt",
                path: "input.prompt",
                isRequired: true,
                type: "string",
              },
              {
                default: "You are a helpful assistant.",
                description:
                  'The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation. By default, the model’s behavior is using a generic message as "You are a helpful assistant."',
                title: "System message",
                _type: "formItem",
                fieldKey: "system_message",
                path: "input.system_message",
                isRequired: false,
                type: "string",
              },
              {
                default: 1,
                example: 1,
                description:
                  "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n\nWe generally recommend altering this or `top_p` but not both.\n",
                title: "Temperature",
                _type: "formItem",
                fieldKey: "temperature",
                path: "input.temperature",
                isRequired: false,
                type: "number",
              },
            ],
          },
          {
            title: "Metadata",
            _type: "formItem",
            fieldKey: "metadata",
            path: "metadata",
            isRequired: false,
            type: "object",
          },
          {
            const: "TASK_TEXT_GENERATION",
            _type: "formItem",
            fieldKey: "task",
            path: "task",
            isRequired: false,
            type: "null",
          },
        ],
      },
      TASK_TEXT_EMBEDDINGS: {
        _type: "formGroup",
        fieldKey: null,
        path: null,
        isRequired: false,
        jsonSchema: {
          type: "object",
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
          required: ["input"],
        },
        properties: [
          {
            _type: "formGroup",
            fieldKey: "input",
            path: "input",
            isRequired: true,
            jsonSchema: {
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
            properties: [
              {
                description:
                  "ID of the model to use. You can use the [List models](https://platform.openai.com/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](https://platform.openai.com/docs/models/overview) for descriptions of them.\n",
                example: "text-embedding-ada-002",
                title: "Model",
                enum: ["text-embedding-ada-002"],
                _type: "formItem",
                fieldKey: "model",
                path: "input.model",
                isRequired: true,
                type: "string",
              },
              {
                description: "",
                title: "Text",
                _type: "formItem",
                fieldKey: "text",
                path: "input.text",
                isRequired: true,
                type: "string",
              },
            ],
          },
          {
            title: "Metadata",
            _type: "formItem",
            fieldKey: "metadata",
            path: "metadata",
            isRequired: false,
            type: "object",
          },
          {
            const: "TASK_TEXT_EMBEDDINGS",
            _type: "formItem",
            fieldKey: "task",
            path: "task",
            isRequired: false,
            type: "null",
          },
        ],
      },
      TASK_SPEECH_RECOGNITION: {
        _type: "formGroup",
        fieldKey: null,
        path: null,
        isRequired: false,
        jsonSchema: {
          type: "object",
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
          required: ["input"],
        },
        properties: [
          {
            _type: "formGroup",
            fieldKey: "input",
            path: "input",
            isRequired: true,
            jsonSchema: {
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
            properties: [
              {
                description:
                  "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                title: "Audio",
                _type: "formItem",
                fieldKey: "audio",
                path: "input.audio",
                isRequired: true,
                type: "string",
              },
              {
                description:
                  "The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.\n",
                title: "Language",
                _type: "formItem",
                fieldKey: "language",
                path: "input.language",
                isRequired: false,
                type: "string",
              },
              {
                description:
                  "ID of the model to use. Only `whisper-1` is currently available.\n",
                example: "whisper-1",
                title: "Model",
                enum: ["whisper-1"],
                _type: "formItem",
                fieldKey: "model",
                path: "input.model",
                isRequired: true,
                type: "string",
              },
              {
                description:
                  "An optional text to guide the model's style or continue a previous audio segment. The [prompt](https://platform.openai.com/docs/guides/speech-to-text/prompting) should match the audio language.\n",
                title: "Prompt",
                _type: "formItem",
                fieldKey: "prompt",
                path: "input.prompt",
                isRequired: false,
                type: "string",
              },
              {
                description:
                  "The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.\n",
                title: "Temperature",
                _type: "formItem",
                fieldKey: "temperature",
                path: "input.temperature",
                isRequired: false,
                type: "number",
              },
            ],
          },
          {
            title: "Metadata",
            _type: "formItem",
            fieldKey: "metadata",
            path: "metadata",
            isRequired: false,
            type: "object",
          },
          {
            const: "TASK_SPEECH_RECOGNITION",
            _type: "formItem",
            fieldKey: "task",
            path: "task",
            isRequired: false,
            type: "null",
          },
        ],
      },
    },
    isRequired: false,
    jsonSchema: {
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
    },
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

  const formTree = transformInstillJSONSchemaToFormTree({
    targetSchema: schema,
  });

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
