import { expect, test } from "vitest";

import { InstillFormTree } from "../types";
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

test("should transform objectArray", () => {
  const tree: InstillFormTree = {
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
              isHidden: false,
              instillAcceptFormats: [],
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
  };

  const value = transformInstillFormTreeToDefaultValue(tree);

  expect(value).toStrictEqual({
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
    }),
  ).toStrictEqual({
    input: { audio: null },
    task: "TASK_SPEECH_RECOGNITION",
  });

  expect(
    transformInstillFormTreeToDefaultValue(tree, {
      selectedConditionMap: {
        task: "TASK_SPEECH_RECOGNITION",
      },
    }),
  ).toStrictEqual({
    input: { audio: null },
    task: "TASK_SPEECH_RECOGNITION",
  });
});

test("should transform complicated real-world case", () => {
  const formTree: InstillFormTree = {
    description:
      'OpenAI\'s text generation models (often called generative pre-trained transformers or large language models) have been trained to understand natural language, code, and images. The models provide text outputs in response to their inputs. The inputs to these models are also referred to as "prompts". Designing a prompt is essentially how you “program” a large language model model, usually by providing instructions or some examples of how to successfully complete a task.',
    instillShortDescription:
      "Provide text outputs in response to their inputs.",
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
            condition: {
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "config whether the component will be executed or skipped",
              instillUIOrder: 1,
              instillUpstreamTypes: ["value", "template"],
              type: "string",
            },
            input: {
              instillEditOnNodeFields: ["model", "prompt", "response-format"],
              instillUIOrder: 0,
              properties: {
                model: {
                  anyOf: [
                    {
                      enum: [
                        "gpt-4o-mini",
                        "gpt-4o",
                        "gpt-4o-2024-05-13",
                        "gpt-4o-2024-08-06",
                        "gpt-4-turbo",
                        "gpt-4-turbo-2024-04-09",
                        "gpt-4-0125-preview",
                        "gpt-4-turbo-preview",
                        "gpt-4-1106-preview",
                        "gpt-4-vision-preview",
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
                        "gpt-3.5-turbo-1106",
                        "gpt-3.5-turbo-0125",
                        "gpt-3.5-turbo-16k-0613",
                      ],
                      example: "gpt-4o",
                      instillCredentialMap: {
                        targets: ["setup.api-key"],
                        values: [
                          "gpt-4o",
                          "gpt-4o-2024-08-06",
                          "gpt-4-turbo",
                          "gpt-4-vision-preview",
                          "gpt-4",
                          "gpt-4-32k",
                          "gpt-3.5-turbo",
                          "gpt-4o-mini",
                        ],
                      },
                      instillUpstreamType: "value",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description: "ID of the model to use.",
                  instillAcceptFormats: ["string"],
                  instillShortDescription: "ID of the model to use",
                  instillUIOrder: 0,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Model",
                },
                "response-format": {
                  additionalProperties: true,
                  description: "Response format.",
                  instillEditOnNodeFields: ["type"],
                  instillUIOrder: 8,
                  oneOf: [
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "text",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "json_object",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type", "json-schema"],
                      instillUIOrder: 0,
                      properties: {
                        "json-schema": {
                          anyOf: [
                            {
                              instillUIMultiline: true,
                              instillUpstreamType: "value",
                              type: "string",
                            },
                            {
                              instillUpstreamType: "reference",
                              pattern: "^\\{.*\\}$",
                              type: "string",
                            },
                          ],
                          description:
                            "Set up the schema of the structured output.",
                          instillAcceptFormats: ["string"],
                          instillShortDescription:
                            "Specify the schema of the structured output.",
                          instillUIOrder: 1,
                          instillUpstreamTypes: ["value", "reference"],
                          title: "JSON Schema",
                        },
                        type: {
                          const: "json_schema",
                          type: "string",
                        },
                      },
                      required: ["type", "json-schema"],
                      type: "object",
                    },
                  ],
                  required: ["type"],
                  title: "Response Format",
                  type: "object",
                },
                "top-p": {
                  anyOf: [
                    {
                      default: 1,
                      example: 1,
                      instillUpstreamType: "value",
                      maximum: 1,
                      minimum: 0,
                      nullable: true,
                      type: "number",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\n\nWe generally recommend altering this or `temperature` but not both.\n",
                  instillAcceptFormats: ["number", "integer"],
                  instillShortDescription:
                    "An alternative to sampling with temperature, called nucleus sampling",
                  instillUIOrder: 9,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Top P",
                },
              },
              required: ["model", "prompt"],
              title: "Input",
              type: "object",
            },
            task: {
              const: "TASK_TEXT_GENERATION",
              description:
                'OpenAI\'s text generation models (often called generative pre-trained transformers or large language models) have been trained to understand natural language, code, and images. The models provide text outputs in response to their inputs. The inputs to these models are also referred to as "prompts". Designing a prompt is essentially how you “program” a large language model model, usually by providing instructions or some examples of how to successfully complete a task.',
              instillShortDescription:
                "Provide text outputs in response to their inputs.",
              title: "Text Generation",
            },
            setup: {
              $schema: "http://json-schema.org/draft-07/schema#",
              additionalProperties: true,
              instillEditOnNodeFields: ["api-key"],
              instillShortDescription: "",
              properties: {
                "api-key": {
                  description:
                    "Fill in your OpenAI API key. To find your keys, visit your OpenAI's API Keys page.",
                  instillAcceptFormats: ["string"],
                  instillCredential: true,
                  instillSecret: true,
                  instillShortDescription:
                    "Fill in your OpenAI API key. To find your keys, visit your OpenAI's API Keys page.",
                  instillUIOrder: 0,
                  instillUpstreamTypes: ["reference"],
                  title: "API Key",
                  type: "string",
                },
                organization: {
                  description:
                    "Specify which organization is used for the requests. Usage will count against the specified organization's subscription quota.",
                  instillAcceptFormats: ["string"],
                  instillShortDescription:
                    "Specify which organization is used for the requests. Usage will count against the specified organization's subscription quota.",
                  instillUIOrder: 1,
                  instillUpstreamTypes: ["value"],
                  title: "Organization ID",
                  type: "string",
                },
              },
              required: ["api-key"],
              title: "OpenAI Connection",
              type: "object",
            },
          },
        },
        properties: [
          {
            instillEditOnNodeFields: ["model", "prompt", "response-format"],
            instillUIOrder: 0,
            title: "Input",
            _type: "formGroup",
            fieldKey: "input",
            path: "input",
            isRequired: false,
            jsonSchema: {
              instillEditOnNodeFields: ["model", "prompt", "response-format"],
              instillUIOrder: 0,
              properties: {
                model: {
                  anyOf: [
                    {
                      enum: [
                        "gpt-4o-mini",
                        "gpt-4o",
                        "gpt-4o-2024-05-13",
                        "gpt-4o-2024-08-06",
                        "gpt-4-turbo",
                        "gpt-4-turbo-2024-04-09",
                        "gpt-4-0125-preview",
                        "gpt-4-turbo-preview",
                        "gpt-4-1106-preview",
                        "gpt-4-vision-preview",
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
                        "gpt-3.5-turbo-1106",
                        "gpt-3.5-turbo-0125",
                        "gpt-3.5-turbo-16k-0613",
                      ],
                      example: "gpt-4o",
                      instillCredentialMap: {
                        targets: ["setup.api-key"],
                        values: [
                          "gpt-4o",
                          "gpt-4o-2024-08-06",
                          "gpt-4-turbo",
                          "gpt-4-vision-preview",
                          "gpt-4",
                          "gpt-4-32k",
                          "gpt-3.5-turbo",
                          "gpt-4o-mini",
                        ],
                      },
                      instillUpstreamType: "value",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description: "ID of the model to use.",
                  instillAcceptFormats: ["string"],
                  instillShortDescription: "ID of the model to use",
                  instillUIOrder: 0,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Model",
                },
                "response-format": {
                  additionalProperties: true,
                  description: "Response format.",
                  instillEditOnNodeFields: ["type"],
                  instillUIOrder: 8,
                  oneOf: [
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "text",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "json_object",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type", "json-schema"],
                      instillUIOrder: 0,
                      properties: {
                        "json-schema": {
                          anyOf: [
                            {
                              instillUIMultiline: true,
                              instillUpstreamType: "value",
                              type: "string",
                            },
                            {
                              instillUpstreamType: "reference",
                              pattern: "^\\{.*\\}$",
                              type: "string",
                            },
                          ],
                          description:
                            "Set up the schema of the structured output.",
                          instillAcceptFormats: ["string"],
                          instillShortDescription:
                            "Specify the schema of the structured output.",
                          instillUIOrder: 1,
                          instillUpstreamTypes: ["value", "reference"],
                          title: "JSON Schema",
                        },
                        type: {
                          const: "json_schema",
                          type: "string",
                        },
                      },
                      required: ["type", "json-schema"],
                      type: "object",
                    },
                  ],
                  required: ["type"],
                  title: "Response Format",
                  type: "object",
                },
                "top-p": {
                  anyOf: [
                    {
                      default: 1,
                      example: 1,
                      instillUpstreamType: "value",
                      maximum: 1,
                      minimum: 0,
                      nullable: true,
                      type: "number",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\n\nWe generally recommend altering this or `temperature` but not both.\n",
                  instillAcceptFormats: ["number", "integer"],
                  instillShortDescription:
                    "An alternative to sampling with temperature, called nucleus sampling",
                  instillUIOrder: 9,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Top P",
                },
              },
              required: ["model", "prompt"],
              title: "Input",
              type: "object",
            },
            properties: [
              {
                description: "ID of the model to use.",
                instillAcceptFormats: ["string"],
                instillShortDescription: "ID of the model to use",
                instillUIOrder: 0,
                instillUpstreamTypes: ["value", "reference", "template"],
                title: "Model",
                example: "gpt-4o",
                instillCredentialMap: {
                  targets: ["setup.api-key"],
                  values: [
                    "gpt-4o",
                    "gpt-4o-2024-08-06",
                    "gpt-4-turbo",
                    "gpt-4-vision-preview",
                    "gpt-4",
                    "gpt-4-32k",
                    "gpt-3.5-turbo",
                    "gpt-4o-mini",
                  ],
                },
                enum: [
                  "gpt-4o-mini",
                  "gpt-4o",
                  "gpt-4o-2024-05-13",
                  "gpt-4o-2024-08-06",
                  "gpt-4-turbo",
                  "gpt-4-turbo-2024-04-09",
                  "gpt-4-0125-preview",
                  "gpt-4-turbo-preview",
                  "gpt-4-1106-preview",
                  "gpt-4-vision-preview",
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
                  "gpt-3.5-turbo-1106",
                  "gpt-3.5-turbo-0125",
                  "gpt-3.5-turbo-16k-0613",
                ],
                _type: "formItem",
                fieldKey: "model",
                path: "input.model",
                isRequired: true,
                type: "string",
                isHidden: false,
              },
              {
                description: "Response format.",
                instillEditOnNodeFields: ["type"],
                instillUIOrder: 8,
                title: "Response Format",
                _type: "formCondition",
                fieldKey: "response-format",
                path: "input.response-format",
                conditions: {
                  text: {
                    instillEditOnNodeFields: ["type"],
                    instillUIOrder: 0,
                    _type: "formGroup",
                    fieldKey: "response-format",
                    path: "input.response-format",
                    isRequired: false,
                    jsonSchema: {
                      type: "object",
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "text",
                          type: "string",
                        },
                      },
                      required: ["type"],
                    },
                    properties: [
                      {
                        const: "text",
                        _type: "formItem",
                        fieldKey: "type",
                        path: "input.response-format.type",
                        isRequired: true,
                        type: "string",
                        isHidden: false,
                        instillAcceptFormats: [],
                      },
                    ],
                    isHidden: false,
                  },
                  json_object: {
                    instillEditOnNodeFields: ["type"],
                    instillUIOrder: 0,
                    _type: "formGroup",
                    fieldKey: "response-format",
                    path: "input.response-format",
                    isRequired: false,
                    jsonSchema: {
                      type: "object",
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "json_object",
                          type: "string",
                        },
                      },
                      required: ["type"],
                    },
                    properties: [
                      {
                        const: "json_object",
                        _type: "formItem",
                        fieldKey: "type",
                        path: "input.response-format.type",
                        isRequired: true,
                        type: "string",
                        isHidden: false,
                        instillAcceptFormats: [],
                      },
                    ],
                    isHidden: false,
                  },
                  json_schema: {
                    instillEditOnNodeFields: ["type", "json-schema"],
                    instillUIOrder: 0,
                    _type: "formGroup",
                    fieldKey: "response-format",
                    path: "input.response-format",
                    isRequired: false,
                    jsonSchema: {
                      type: "object",
                      instillEditOnNodeFields: ["type", "json-schema"],
                      instillUIOrder: 0,
                      properties: {
                        "json-schema": {
                          anyOf: [
                            {
                              instillUIMultiline: true,
                              instillUpstreamType: "value",
                              type: "string",
                            },
                            {
                              instillUpstreamType: "reference",
                              pattern: "^\\{.*\\}$",
                              type: "string",
                            },
                          ],
                          description:
                            "Set up the schema of the structured output.",
                          instillAcceptFormats: ["string"],
                          instillShortDescription:
                            "Specify the schema of the structured output.",
                          instillUIOrder: 1,
                          instillUpstreamTypes: ["value", "reference"],
                          title: "JSON Schema",
                        },
                        type: {
                          const: "json_schema",
                          type: "string",
                        },
                      },
                      required: ["type", "json-schema"],
                    },
                    properties: [
                      {
                        instillUIMultiline: true,
                        description:
                          "Set up the schema of the structured output.",
                        instillAcceptFormats: ["string"],
                        instillShortDescription:
                          "Specify the schema of the structured output.",
                        instillUIOrder: 1,
                        instillUpstreamTypes: ["value", "reference"],
                        title: "JSON Schema",
                        _type: "formItem",
                        fieldKey: "json-schema",
                        path: "input.response-format.json-schema",
                        isRequired: true,
                        type: "string",
                        isHidden: false,
                      },
                      {
                        const: "json_schema",
                        _type: "formItem",
                        fieldKey: "type",
                        path: "input.response-format.type",
                        isRequired: true,
                        type: "string",
                        isHidden: false,
                        instillAcceptFormats: [],
                      },
                    ],
                    isHidden: false,
                  },
                },
                isRequired: false,
                isHidden: false,
                jsonSchema: {
                  additionalProperties: true,
                  description: "Response format.",
                  instillEditOnNodeFields: ["type"],
                  instillUIOrder: 8,
                  oneOf: [
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "text",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "json_object",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type", "json-schema"],
                      instillUIOrder: 0,
                      properties: {
                        "json-schema": {
                          anyOf: [
                            {
                              instillUIMultiline: true,
                              instillUpstreamType: "value",
                              type: "string",
                            },
                            {
                              instillUpstreamType: "reference",
                              pattern: "^\\{.*\\}$",
                              type: "string",
                            },
                          ],
                          description:
                            "Set up the schema of the structured output.",
                          instillAcceptFormats: ["string"],
                          instillShortDescription:
                            "Specify the schema of the structured output.",
                          instillUIOrder: 1,
                          instillUpstreamTypes: ["value", "reference"],
                          title: "JSON Schema",
                        },
                        type: {
                          const: "json_schema",
                          type: "string",
                        },
                      },
                      required: ["type", "json-schema"],
                      type: "object",
                    },
                  ],
                  required: ["type"],
                  title: "Response Format",
                  type: "object",
                },
              },
              {
                default: 1,
                example: 1,
                description:
                  "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\n\nWe generally recommend altering this or `temperature` but not both.\n",
                instillAcceptFormats: ["number", "integer"],
                instillShortDescription:
                  "An alternative to sampling with temperature, called nucleus sampling",
                instillUIOrder: 9,
                instillUpstreamTypes: ["value", "reference"],
                title: "Top P",
                _type: "formItem",
                fieldKey: "top-p",
                path: "input.top-p",
                isRequired: false,
                type: "number",
                isHidden: false,
              },
            ],
            isHidden: false,
          },
          {
            instillAcceptFormats: ["string"],
            instillShortDescription:
              "config whether the component will be executed or skipped",
            instillUIOrder: 1,
            instillUpstreamTypes: ["value", "template"],
            _type: "formItem",
            fieldKey: "condition",
            path: "condition",
            isRequired: false,
            type: "string",
            isHidden: false,
          },
          {
            const: "TASK_TEXT_GENERATION",
            description:
              'OpenAI\'s text generation models (often called generative pre-trained transformers or large language models) have been trained to understand natural language, code, and images. The models provide text outputs in response to their inputs. The inputs to these models are also referred to as "prompts". Designing a prompt is essentially how you “program” a large language model model, usually by providing instructions or some examples of how to successfully complete a task.',
            instillShortDescription:
              "Provide text outputs in response to their inputs.",
            title: "Text Generation",
            _type: "formItem",
            fieldKey: "task",
            path: "task",
            isRequired: false,
            type: "null",
            isHidden: false,
            instillAcceptFormats: [],
          },
        ],
        isHidden: false,
      },
    },
    isRequired: false,
    isHidden: false,
    jsonSchema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      oneOf: [
        {
          properties: {
            condition: {
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "config whether the component will be executed or skipped",
              instillUIOrder: 1,
              instillUpstreamTypes: ["value", "template"],
              type: "string",
            },
            input: {
              instillEditOnNodeFields: ["model", "prompt", "response-format"],
              instillUIOrder: 0,
              properties: {
                "chat-history": {
                  anyOf: [
                    {
                      instillUpstreamType: "value",
                      items: {
                        properties: {
                          content: {
                            description: "The message content",
                            instillFormat: "structured/multi-modal-content",
                            instillUIOrder: 1,
                            items: {
                              properties: {
                                "image-url": {
                                  properties: {
                                    url: {
                                      description:
                                        "Either a URL of the image or the base64 encoded image data.",
                                      type: "string",
                                    },
                                  },
                                  required: ["url"],
                                  type: "object",
                                },
                                text: {
                                  description: "The text content.",
                                  instillFormat: "string",
                                  type: "string",
                                },
                                type: {
                                  description: "The type of the content part.",
                                  enum: ["text", "image-url"],
                                  instillFormat: "string",
                                  type: "string",
                                },
                              },
                              required: ["type"],
                              type: "object",
                            },
                            title: "Content",
                            type: "array",
                          },
                          role: {
                            description:
                              "The message role, i.e. 'system', 'user' or 'assistant'",
                            instillFormat: "string",
                            instillUIOrder: 0,
                            title: "Role",
                            type: "string",
                          },
                        },
                        required: ["role", "content"],
                        title: "Chat Message",
                        type: "object",
                      },
                      type: "array",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    'Incorporate external chat history, specifically previous messages within the conversation. Please note that System Message will be ignored and will not have any effect when this field is populated. Each message should adhere to the format {"role": "The message role, i.e. \'system\', \'user\' or \'assistant\'", "content": "message content"}.',
                  instillAcceptFormats: ["structured/chat-messages"],
                  instillShortDescription:
                    'Incorporate external chat history, specifically previous messages within the conversation. Please note that System Message will be ignored and will not have any effect when this field is populated. Each message should be an ojbect adhere to the format: {"role": "The message role, i.e. \'system\', \'user\' or \'assistant\'", "content": "message content"}.',
                  instillUIOrder: 4,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Chat history",
                },
                "frequency-penalty": {
                  anyOf: [
                    {
                      default: 0,
                      instillUpstreamType: "value",
                      maximum: 2,
                      minimum: -2,
                      nullable: true,
                      type: "number",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description:
                    "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
                  instillAcceptFormats: ["number", "integer"],
                  instillShortDescription: "Number between -2.0 and 2.0",
                  instillUIOrder: 11,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Frequency Penalty",
                },
                images: {
                  anyOf: [
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description: "The images",
                  instillAcceptFormats: ["array:image/*"],
                  instillShortDescription: "The images",
                  instillUIOrder: 3,
                  instillUpstreamTypes: ["reference"],
                  title: "Image",
                },
                "max-tokens": {
                  anyOf: [
                    {
                      instillUpstreamType: "value",
                      nullable: true,
                      type: "integer",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    "The maximum number of tokens that can be generated in the chat completion.\n\nThe total length of input tokens and generated tokens is limited by the model's context length.",
                  instillAcceptFormats: ["integer"],
                  instillShortDescription:
                    "The maximum number of tokens to generate in the chat completion.",
                  instillUIOrder: 7,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Max Tokens",
                },
                model: {
                  anyOf: [
                    {
                      enum: [
                        "gpt-4o-mini",
                        "gpt-4o",
                        "gpt-4o-2024-05-13",
                        "gpt-4o-2024-08-06",
                        "gpt-4-turbo",
                        "gpt-4-turbo-2024-04-09",
                        "gpt-4-0125-preview",
                        "gpt-4-turbo-preview",
                        "gpt-4-1106-preview",
                        "gpt-4-vision-preview",
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
                        "gpt-3.5-turbo-1106",
                        "gpt-3.5-turbo-0125",
                        "gpt-3.5-turbo-16k-0613",
                      ],
                      example: "gpt-4o",
                      instillCredentialMap: {
                        targets: ["setup.api-key"],
                        values: [
                          "gpt-4o",
                          "gpt-4o-2024-08-06",
                          "gpt-4-turbo",
                          "gpt-4-vision-preview",
                          "gpt-4",
                          "gpt-4-32k",
                          "gpt-3.5-turbo",
                          "gpt-4o-mini",
                        ],
                      },
                      instillUpstreamType: "value",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description: "ID of the model to use.",
                  instillAcceptFormats: ["string"],
                  instillShortDescription: "ID of the model to use",
                  instillUIOrder: 0,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Model",
                },
                n: {
                  anyOf: [
                    {
                      default: 1,
                      example: 1,
                      instillUpstreamType: "value",
                      maximum: 128,
                      minimum: 1,
                      nullable: true,
                      type: "integer",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    "How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep `n` as `1` to minimize costs.",
                  instillAcceptFormats: ["integer"],
                  instillShortDescription:
                    "How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep `n` as `1` to minimize costs.",
                  instillUIOrder: 6,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "N",
                },
                "presence-penalty": {
                  anyOf: [
                    {
                      default: 0,
                      instillUpstreamType: "value",
                      maximum: 2,
                      minimum: -2,
                      nullable: true,
                      type: "number",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description:
                    "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
                  instillAcceptFormats: ["number", "integer"],
                  instillShortDescription: "Number between -2.0 and 2.0",
                  instillUIOrder: 10,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Presence Penalty",
                },
                prompt: {
                  anyOf: [
                    {
                      instillUIMultiline: true,
                      instillUpstreamType: "value",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description: "The prompt text",
                  instillAcceptFormats: ["string"],
                  instillShortDescription: "The prompt text",
                  instillUIOrder: 1,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "Prompt",
                },
                "response-format": {
                  additionalProperties: true,
                  description: "Response format.",
                  instillEditOnNodeFields: ["type"],
                  instillUIOrder: 8,
                  oneOf: [
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "text",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type"],
                      instillUIOrder: 0,
                      properties: {
                        type: {
                          const: "json_object",
                          type: "string",
                        },
                      },
                      required: ["type"],
                      type: "object",
                    },
                    {
                      instillEditOnNodeFields: ["type", "json-schema"],
                      instillUIOrder: 0,
                      properties: {
                        "json-schema": {
                          anyOf: [
                            {
                              instillUIMultiline: true,
                              instillUpstreamType: "value",
                              type: "string",
                            },
                            {
                              instillUpstreamType: "reference",
                              pattern: "^\\{.*\\}$",
                              type: "string",
                            },
                          ],
                          description:
                            "Set up the schema of the structured output.",
                          instillAcceptFormats: ["string"],
                          instillShortDescription:
                            "Specify the schema of the structured output.",
                          instillUIOrder: 1,
                          instillUpstreamTypes: ["value", "reference"],
                          title: "JSON Schema",
                        },
                        type: {
                          const: "json_schema",
                          type: "string",
                        },
                      },
                      required: ["type", "json-schema"],
                      type: "object",
                    },
                  ],
                  required: ["type"],
                  title: "Response Format",
                  type: "object",
                },
                "system-message": {
                  anyOf: [
                    {
                      default: "You are a helpful assistant.",
                      instillUIMultiline: true,
                      instillUpstreamType: "value",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                    {
                      instillUpstreamType: "template",
                      type: "string",
                    },
                  ],
                  description:
                    'The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation. By default, the model’s behavior is using a generic message as "You are a helpful assistant."',
                  instillAcceptFormats: ["string"],
                  instillShortDescription:
                    "The system message helps set the behavior of the assistant",
                  instillUIOrder: 2,
                  instillUpstreamTypes: ["value", "reference", "template"],
                  title: "System message",
                },
                temperature: {
                  anyOf: [
                    {
                      default: 1,
                      example: 1,
                      instillUpstreamType: "value",
                      maximum: 2,
                      minimum: 0,
                      nullable: true,
                      type: "number",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n\nWe generally recommend altering this or `top-p` but not both.\n",
                  instillAcceptFormats: ["number", "integer"],
                  instillShortDescription:
                    "What sampling temperature to use, between 0 and 2.",
                  instillUIOrder: 5,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Temperature",
                },
                "top-p": {
                  anyOf: [
                    {
                      default: 1,
                      example: 1,
                      instillUpstreamType: "value",
                      maximum: 1,
                      minimum: 0,
                      nullable: true,
                      type: "number",
                    },
                    {
                      instillUpstreamType: "reference",
                      pattern: "^\\{.*\\}$",
                      type: "string",
                    },
                  ],
                  description:
                    "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.\n\nWe generally recommend altering this or `temperature` but not both.\n",
                  instillAcceptFormats: ["number", "integer"],
                  instillShortDescription:
                    "An alternative to sampling with temperature, called nucleus sampling",
                  instillUIOrder: 9,
                  instillUpstreamTypes: ["value", "reference"],
                  title: "Top P",
                },
              },
              required: ["model", "prompt"],
              title: "Input",
              type: "object",
            },
            task: {
              const: "TASK_TEXT_GENERATION",
              description:
                'OpenAI\'s text generation models (often called generative pre-trained transformers or large language models) have been trained to understand natural language, code, and images. The models provide text outputs in response to their inputs. The inputs to these models are also referred to as "prompts". Designing a prompt is essentially how you “program” a large language model model, usually by providing instructions or some examples of how to successfully complete a task.',
              instillShortDescription:
                "Provide text outputs in response to their inputs.",
              title: "Text Generation",
            },
          },
          type: "object",
        },
      ],
      title: "OpenAI Component",
      type: "object",
    },
  };

  const result = transformInstillFormTreeToDefaultValue(formTree);

  const expected = {
    input: {
      model: "gpt-4o",
      "response-format": { type: "text" },
      "top-p": "1",
    },
    condition: null,
    task: "TASK_TEXT_GENERATION",
  };

  expect(result).toEqual(expected);
});
