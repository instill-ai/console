import { InstillFormTree } from "../type";
import { test, expect } from "vitest";
import { transformInstillFormTreeToDefaultValue } from "./transformInstillFormTreeToDefaultValue";

test("should transform formItem with example", () => {
  const tree: InstillFormTree = {
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
    path: "model",
    isRequired: true,
    type: "string",
  };

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({ model: "gpt-3.5-turbo" });
});

test("should transform formItem with examples", () => {
  const tree: InstillFormTree = {
    description:
      "ID of the model to use. See the [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.",
    examples: ["gpt-3.5-turbo"],
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
    path: "model",
    isRequired: true,
    type: "string",
  };

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({
    model: "gpt-3.5-turbo",
  });
});

test("should transform formGroup", () => {
  const tree: InstillFormTree = {
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
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
        path: "model",
        isRequired: true,
        type: "string",
      },
      {
        description: "",
        title: "Text",
        _type: "formItem",
        fieldKey: "text",
        path: "text",
        isRequired: true,
        type: "string",
      },
    ],
  };

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({
    model: "text-embedding-ada-002",
    text: null,
  });
});

test("should transform formCondition", () => {
  const tree: InstillFormTree = {
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
                model: {
                  type: "string",
                },
              },
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
                model: {
                  type: "string",
                },
              },
              type: "object",
            },
            properties: [
              {
                _type: "formItem",
                fieldKey: "model",
                path: "input.model",
                isRequired: false,
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
                text: {
                  type: "string",
                  description: "",
                  instillFormat: "text",
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
                text: {
                  type: "string",
                  description: "",
                  instillFormat: "text",
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Text",
                },
              },
              required: ["text"],
              type: "object",
            },
            properties: [
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
              },
              required: ["audio"],
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
                model: {
                  type: "string",
                },
              },
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
                  type: "string",
                  description: "",
                  instillFormat: "text",
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
                  type: "string",
                  description:
                    "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                  instillFormat: "audio",
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
    },
  };

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({
    input: { model: null },
    metadata: null,
    task: "TASK_TEXT_GENERATION",
  });
});

test("should transform nested formCondition", () => {
  const tree: InstillFormTree = {
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
          required: ["input"],
        },
        properties: [
          {
            _type: "formCondition",
            fieldKey: "input",
            path: "input",
            conditions: {
              MODEL_DAVINCI: {
                _type: "formGroup",
                fieldKey: "input",
                path: "input",
                isRequired: true,
                jsonSchema: {
                  type: "object",
                  properties: {
                    model: {
                      const: "MODEL_DAVINCI",
                    },
                    prompt: {
                      type: "string",
                    },
                  },
                },
                properties: [
                  {
                    const: "MODEL_DAVINCI",
                    _type: "formItem",
                    fieldKey: "model",
                    path: "input.model",
                    isRequired: false,
                    type: "null",
                  },
                  {
                    _type: "formItem",
                    fieldKey: "prompt",
                    path: "input.prompt",
                    isRequired: false,
                    type: "string",
                  },
                ],
              },
              MODEL_GPT4: {
                _type: "formGroup",
                fieldKey: "input",
                path: "input",
                isRequired: true,
                jsonSchema: {
                  type: "object",
                  properties: {
                    model: {
                      const: "MODEL_GPT4",
                    },
                    system_message: {
                      type: "string",
                    },
                  },
                },
                properties: [
                  {
                    const: "MODEL_GPT4",
                    _type: "formItem",
                    fieldKey: "model",
                    path: "input.model",
                    isRequired: false,
                    type: "null",
                  },
                  {
                    _type: "formItem",
                    fieldKey: "system_message",
                    path: "input.system_message",
                    isRequired: false,
                    type: "string",
                  },
                ],
              },
            },
            isRequired: true,
            jsonSchema: {
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
                },
              ],
              type: "object",
            },
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
                text: {
                  type: "string",
                  description: "",
                  instillFormat: "text",
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
                text: {
                  type: "string",
                  description: "",
                  instillFormat: "text",
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Text",
                },
              },
              required: ["text"],
              type: "object",
            },
            properties: [
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
              },
              required: ["audio"],
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
                  type: "string",
                  description: "",
                  instillFormat: "text",
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
                  type: "string",
                  description:
                    "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                  instillFormat: "audio",
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
    },
  };

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({
    input: { model: "MODEL_DAVINCI", prompt: null },
    metadata: null,
    task: "TASK_TEXT_GENERATION",
  });
});

test("should transform formArray", () => {
  const tree: InstillFormTree = {
    _type: "formGroup",
    fieldKey: null,
    path: null,
    isRequired: false,
    jsonSchema: {
      type: "object",
      required: ["host", "ports"],
      properties: {
        host: {
          type: "string",
          description: "Hostname of the database.",
          example: "hello-world",
        },
        ports: {
          type: "array",
          items: {
            properties: {
              port: {
                type: "integer",
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
              type: "integer",
              description: "Port of the database.",
              examples: [5432],
            },
          },
          type: "object",
        },
        properties: [
          {
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

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({
    host: "hello-world",
    ports: [{ port: "5432" }],
  });
});

test("should transform to selected conditions", () => {
  const tree: InstillFormTree = {
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
              oneOf: [
                {
                  properties: {
                    model: {
                      const: "MODEL_DAVINCI",
                    },
                    prompt: {
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "template",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "reference",
                        },
                      ],
                      instillUpstreamTypes: ["value", "reference", "template"],
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
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                      ],
                      instillUpstreamTypes: ["value"],
                    },
                  },
                  required: ["system_message", "model"],
                },
              ],
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
            _type: "formCondition",
            fieldKey: "input",
            path: "input",
            conditions: {
              MODEL_DAVINCI: {
                _type: "formGroup",
                fieldKey: "input",
                path: "input",
                isRequired: true,
                jsonSchema: {
                  type: "object",
                  properties: {
                    model: {
                      const: "MODEL_DAVINCI",
                    },
                    prompt: {
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "template",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "reference",
                        },
                      ],
                      instillUpstreamTypes: ["value", "reference", "template"],
                    },
                  },
                  required: ["prompt", "model"],
                },
                properties: [
                  {
                    const: "MODEL_DAVINCI",
                    _type: "formItem",
                    fieldKey: "model",
                    path: "input.model",
                    isRequired: true,
                    type: "null",
                  },
                  {
                    instillUpstreamTypes: ["value", "reference", "template"],
                    _type: "formItem",
                    fieldKey: "prompt",
                    path: "input.prompt",
                    isRequired: true,
                    type: "string",
                  },
                ],
              },
              MODEL_GPT4: {
                _type: "formGroup",
                fieldKey: "input",
                path: "input",
                isRequired: true,
                jsonSchema: {
                  type: "object",
                  properties: {
                    model: {
                      const: "MODEL_GPT4",
                    },
                    system_message: {
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                      ],
                      instillUpstreamTypes: ["value"],
                    },
                  },
                  required: ["system_message", "model"],
                },
                properties: [
                  {
                    const: "MODEL_GPT4",
                    _type: "formItem",
                    fieldKey: "model",
                    path: "input.model",
                    isRequired: true,
                    type: "null",
                  },
                  {
                    instillUpstreamTypes: ["value"],
                    _type: "formItem",
                    fieldKey: "system_message",
                    path: "input.system_message",
                    isRequired: true,
                    type: "string",
                  },
                ],
              },
            },
            isRequired: true,
            jsonSchema: {
              oneOf: [
                {
                  properties: {
                    model: {
                      const: "MODEL_DAVINCI",
                    },
                    prompt: {
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "template",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "reference",
                        },
                      ],
                      instillUpstreamTypes: ["value", "reference", "template"],
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
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                      ],
                      instillUpstreamTypes: ["value"],
                    },
                  },
                  required: ["system_message", "model"],
                },
              ],
              type: "object",
            },
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
                      instillUpstreamType: "template",
                    },
                    {
                      type: "string",
                      instillUpstreamType: "reference",
                    },
                  ],
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Text",
                },
              },
              required: ["text"],
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
                      instillUpstreamType: "template",
                    },
                    {
                      type: "string",
                      instillUpstreamType: "reference",
                    },
                  ],
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Text",
                },
              },
              required: ["text"],
              type: "object",
            },
            properties: [
              {
                description: "",
                instillUpstreamTypes: ["value", "reference", "template"],
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
                  description:
                    "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                  instillFormat: "audio",
                  anyOf: [
                    {
                      type: "string",
                      instillUpstreamType: "reference",
                    },
                  ],
                  instillUpstreamTypes: ["reference"],
                  title: "Audio",
                },
              },
              required: ["audio"],
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
                  description:
                    "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                  instillFormat: "audio",
                  anyOf: [
                    {
                      type: "string",
                      instillUpstreamType: "reference",
                    },
                  ],
                  instillUpstreamTypes: ["reference"],
                  title: "Audio",
                },
              },
              required: ["audio"],
              type: "object",
            },
            properties: [
              {
                description:
                  "The audio file object (not file name) to transcribe, in one of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n",
                instillUpstreamTypes: ["reference"],
                title: "Audio",
                _type: "formItem",
                fieldKey: "audio",
                path: "input.audio",
                isRequired: true,
                type: "null",
              },
            ],
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
              oneOf: [
                {
                  properties: {
                    model: {
                      const: "MODEL_DAVINCI",
                    },
                    prompt: {
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "template",
                        },
                        {
                          type: "string",
                          instillUpstreamType: "reference",
                        },
                      ],
                      instillUpstreamTypes: ["value", "reference", "template"],
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
                      anyOf: [
                        {
                          type: "string",
                          instillUpstreamType: "value",
                        },
                      ],
                      instillUpstreamTypes: ["value"],
                    },
                  },
                  required: ["system_message", "model"],
                },
              ],
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
                    {
                      type: "string",
                      instillUpstreamType: "value",
                    },
                    {
                      type: "string",
                      instillUpstreamType: "template",
                    },
                    {
                      type: "string",
                      instillUpstreamType: "reference",
                    },
                  ],
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Text",
                },
              },
              required: ["text"],
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
                  anyOf: [
                    {
                      type: "string",
                      instillUpstreamType: "reference",
                    },
                  ],
                  instillUpstreamTypes: ["reference"],
                  title: "Audio",
                },
              },
              required: ["audio"],
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

  expect(
    transformInstillFormTreeToDefaultValue(tree, {
      selectedConditionMap: {
        task: "TASK_SPEECH_RECOGNITION",
      },
    })
  ).toStrictEqual({
    input: { audio: null },
    task: "TASK_SPEECH_RECOGNITION",
  });

  expect(
    transformInstillFormTreeToDefaultValue(tree, {
      selectedConditionMap: {
        task: "TASK_SPEECH_RECOGNITION",
      },
    })
  ).toStrictEqual({
    input: { audio: null },
    task: "TASK_SPEECH_RECOGNITION",
  });
});
