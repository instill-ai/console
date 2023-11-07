import { test, expect } from "vitest";
import { InstillFormTree } from "../type";
import { transformInstillFormTreeToInitialSelectedCondition } from "./transformInstillFormTreeToInitialSelectedCondition";

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

  const selectedConditionMap =
    transformInstillFormTreeToInitialSelectedCondition(tree);

  expect(selectedConditionMap).toStrictEqual({
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

  const selectedConditionMap =
    transformInstillFormTreeToInitialSelectedCondition(tree);

  expect(selectedConditionMap).toStrictEqual({
    task: "TASK_TEXT_GENERATION",
    "input.model": "MODEL_DAVINCI",
  });
});

test("should select the condition in the initial data", () => {
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

  const selectedConditionMap =
    transformInstillFormTreeToInitialSelectedCondition(tree, {
      initialData: {
        task: "TASK_SPEECH_RECOGNITION",
      },
    });
});
