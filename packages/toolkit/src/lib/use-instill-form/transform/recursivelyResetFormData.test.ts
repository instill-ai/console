import { test, expect } from "vitest";
import { InstillFormTree } from "../type";
import { recursivelyResetFormData } from "./recursivelyResetFormData";

test("should reset basic form data", () => {
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

  const data = {
    input: {
      model: "davinci",
    },
    task: "TASK_TEXT_GENERATION",
  };

  const selectedConditionMap = {
    task: "TASK_TEXT_GENERATION",
  };

  recursivelyResetFormData(
    tree.conditions["TASK_TEXT_GENERATION"],
    selectedConditionMap,
    data
  );

  expect(data).toStrictEqual({
    input: {
      model: null,
    },
    task: "TASK_TEXT_GENERATION",
  });
});

//This is not working properly yet
test.skip("should reset nested oneOf form data", () => {
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
                foo: {
                  title: "Foo",
                  oneOf: [
                    {
                      properties: {
                        bar_1: {
                          type: "string",
                        },
                        "foo-condition": {
                          const: "hello",
                        },
                      },
                    },
                    {
                      properties: {
                        bar_2: {
                          type: "number",
                        },
                        "foo-condition": {
                          const: "world",
                        },
                      },
                    },
                  ],
                },
              },
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
                foo: {
                  title: "Foo",
                  oneOf: [
                    {
                      properties: {
                        bar_1: {
                          type: "string",
                        },
                        "foo-condition": {
                          const: "hello",
                        },
                      },
                    },
                    {
                      properties: {
                        bar_2: {
                          type: "number",
                        },
                        "foo-condition": {
                          const: "world",
                        },
                      },
                    },
                  ],
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
              {
                title: "Foo",
                _type: "formCondition",
                fieldKey: "foo",
                path: "input.foo",
                conditions: {
                  hello: {
                    _type: "formGroup",
                    fieldKey: "foo",
                    path: "input.foo",
                    isRequired: false,
                    jsonSchema: {
                      properties: {
                        bar_1: {
                          type: "string",
                        },
                        "foo-condition": {
                          const: "hello",
                        },
                      },
                    },
                    properties: [
                      {
                        _type: "formItem",
                        fieldKey: "bar_1",
                        path: "input.foo.bar_1",
                        isRequired: false,
                        type: "string",
                      },
                      {
                        const: "hello",
                        _type: "formItem",
                        fieldKey: "foo-condition",
                        path: "input.foo.foo-condition",
                        isRequired: false,
                        type: "null",
                      },
                    ],
                  },
                  world: {
                    _type: "formGroup",
                    fieldKey: "foo",
                    path: "input.foo",
                    isRequired: false,
                    jsonSchema: {
                      properties: {
                        bar_2: {
                          type: "number",
                        },
                        "foo-condition": {
                          const: "world",
                        },
                      },
                    },
                    properties: [
                      {
                        _type: "formItem",
                        fieldKey: "bar_2",
                        path: "input.foo.bar_2",
                        isRequired: false,
                        type: "number",
                      },
                      {
                        const: "world",
                        _type: "formItem",
                        fieldKey: "foo-condition",
                        path: "input.foo.foo-condition",
                        isRequired: false,
                        type: "null",
                      },
                    ],
                  },
                },
                isRequired: false,
                jsonSchema: {
                  title: "Foo",
                  oneOf: [
                    {
                      properties: {
                        bar_1: {
                          type: "string",
                        },
                        "foo-condition": {
                          const: "hello",
                        },
                      },
                    },
                    {
                      properties: {
                        bar_2: {
                          type: "number",
                        },
                        "foo-condition": {
                          const: "world",
                        },
                      },
                    },
                  ],
                },
              },
            ],
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
                foo: {
                  title: "Foo",
                  oneOf: [
                    {
                      properties: {
                        bar_1: {
                          type: "string",
                        },
                        "foo-condition": {
                          const: "hello",
                        },
                      },
                    },
                    {
                      properties: {
                        bar_2: {
                          type: "number",
                        },
                        "foo-condition": {
                          const: "world",
                        },
                      },
                    },
                  ],
                },
              },
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

  const data = {
    input: {
      model: "davinci",
      foo: {
        bar_1: "yoyo",
        "foo-condition": "hello",
      },
    },
    task: "TASK_TEXT_GENERATION",
  };

  const selectedConditionMap = {
    task: "TASK_TEXT_GENERATION",
    "input.foo.foo-condition": "world",
  };

  recursivelyResetFormData(
    tree.conditions["TASK_TEXT_GENERATION"],
    selectedConditionMap,
    data
  );
});
