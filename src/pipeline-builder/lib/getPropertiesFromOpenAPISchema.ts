import { OpenAPIV3 } from "openapi-types";

export type InstillAIOpenAPIProperty = OpenAPIV3.SchemaObject & {
  path?: string;
  instillFormat?: string;
};

export function getPropertiesFromOpenAPISchema(
  schema: OpenAPIV3.SchemaObject,
  parentKey?: string,
  title?: string,
  parentIsArray?: boolean
) {
  let properties: InstillAIOpenAPIProperty[] = [];

  if (schema.type === "object") {
    if (schema.properties) {
      Object.entries(schema.properties as OpenAPIV3.SchemaObject).map(
        ([key, value]) => {
          const parentKeyList = parentKey ? parentKey.split(".") : [];

          properties = [
            ...properties,
            ...getPropertiesFromOpenAPISchema(
              value,
              [...parentKeyList, key].join(".")
            ),
          ];
        }
      );
    }
  } else if (schema.type === "array") {
    properties = [
      ...properties,
      {
        ...schema,
        items: getPropertiesFromOpenAPISchema(
          schema.items as OpenAPIV3.SchemaObject,
          parentKey,
          schema.title,
          true
        ) as OpenAPIV3.ArraySchemaObject["items"],
        path: parentKey,
      },
    ];
  } else {
    if (parentIsArray) {
      properties.push(schema);
    } else {
      properties.push({
        path: parentKey,
        ...schema,
        title: title ? title : schema.title,
      });
    }
  }

  return properties;
}

const xxx = {
  pipeline: {
    name: "users/instill-ai/pipelines/hissing-violet-cobra",
    uid: "698cc164-26a7-4ec3-80f3-519319c802f2",
    id: "hissing-violet-cobra",
    description: "",
    recipe: {
      version: "v1alpha",
      components: [
        {
          id: "start",
          resource_name: "",
          resource: null,
          configuration: {
            metadata: {
              height: {
                title: "height",
                type: "number",
              },
              prompts: {
                title: "prompts",
                type: "text_array",
              },
              width: {
                title: "width",
                type: "number",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/start-operator",
          operator_definition: {
            name: "operator-definitions/start-operator",
            uid: "2ac8be70-0f7a-4b61-a33d-098b8acfa6f3",
            id: "start-operator",
            title: "Start",
            documentation_url:
              "https://www.instill.tech/docs/vdp/operators/start-operator",
            icon: "start-operator.svg",
            spec: {
              component_specification: {
                $schema: "http://json-schema.org/draft-07/schema#",
                additionalProperties: false,
                properties: {
                  input: {
                    type: "object",
                  },
                  metadata: {
                    additionalProperties: false,
                    patternProperties: {
                      "^[a-zA-Z_][a-zA-Z_0-9]*$": {
                        properties: {
                          description: {
                            type: "string",
                          },
                          title: {
                            type: "string",
                          },
                          type: {
                            description: "Data Type",
                            enum: [
                              "integer",
                              "integer_array",
                              "number",
                              "number_array",
                              "boolean",
                              "boolean_array",
                              "text",
                              "text_array",
                              "image",
                              "image_array",
                              "audio",
                              "audio_array",
                              "video",
                              "video_array",
                            ],
                            title: "Type",
                          },
                        },
                        type: "object",
                      },
                    },
                    type: "object",
                  },
                },
                title: "Start Operator Component Spec",
                type: "object",
              },
            },
            tombstone: false,
            public: true,
            custom: false,
            icon_url: "",
          },
        },
        {
          id: "end",
          resource_name: "",
          resource: null,
          configuration: {
            input: {
              images: "{ st.images }",
            },
            metadata: {
              images: {
                title: "images",
              },
            },
          },
          type: "COMPONENT_TYPE_OPERATOR",
          definition_name: "operator-definitions/end-operator",
          operator_definition: {
            name: "operator-definitions/end-operator",
            uid: "4f39c8bc-8617-495d-80de-80d0f5397516",
            id: "end-operator",
            title: "End",
            documentation_url:
              "https://www.instill.tech/docs/vdp/operators/end-operator",
            icon: "end-operator.svg",
            spec: {
              component_specification: {
                $schema: "http://json-schema.org/draft-07/schema#",
                additionalProperties: false,
                properties: {
                  input: {
                    additionalProperties: false,
                    patternProperties: {
                      "^[a-zA-Z_][a-zA-Z_0-9]*$": {
                        anyOf: [
                          {
                            pattern: "^\\{.*\\}$",
                            type: "string",
                          },
                          {
                            type: "string",
                          },
                          {
                            type: "number",
                          },
                          {
                            type: "integer",
                          },
                          {
                            type: "boolean",
                          },
                        ],
                      },
                    },
                    type: "object",
                  },
                  metadata: {
                    additionalProperties: false,
                    patternProperties: {
                      "^[a-zA-Z_][a-zA-Z_0-9]*$": {
                        properties: {
                          description: {
                            type: "string",
                          },
                          title: {
                            type: "string",
                          },
                          type: {
                            description: "Data Type",
                            enum: [
                              "integer",
                              "integer_array",
                              "number",
                              "number_array",
                              "boolean",
                              "boolean_array",
                              "text",
                              "text_array",
                              "image",
                              "image_array",
                              "audio",
                              "audio_array",
                              "video",
                              "video_array",
                            ],
                            title: "Type",
                          },
                        },
                        type: "object",
                      },
                    },
                    type: "object",
                  },
                },
                title: "End Operator Component Spec",
                type: "object",
              },
            },
            tombstone: false,
            public: true,
            custom: false,
            icon_url: "",
          },
        },
        {
          id: "st",
          resource_name: "users/instill-ai/connector-resources/st",
          resource: {
            name: "users/instill-ai/connector-resources/st",
            uid: "1c3dce62-9cd3-4419-8bf8-4ef016d56c19",
            id: "st",
            connector_definition_name: "connector-definitions/ai-stability-ai",
            type: "CONNECTOR_TYPE_AI",
            description: "",
            configuration: {
              api_key: "*****MASK*****",
            },
            state: "STATE_DISCONNECTED",
            tombstone: false,
            user: "users/instill-ai",
            create_time: "2023-09-06T17:10:32.262074Z",
            update_time: "2023-09-06T17:10:32.264479Z",
            visibility: "VISIBILITY_UNSPECIFIED",
            connector_definition: null,
            delete_time: null,
          },
          configuration: {
            input: {
              engine: "stable-diffusion-xl-1024-v1-0",
              height: "{ start.height }",
              prompts: "{ start.prompts }",
              seed: 0,
              task: "TASK_TEXT_TO_IMAGE",
              width: "{ start.width }",
            },
          },
          type: "COMPONENT_TYPE_CONNECTOR_AI",
          definition_name: "connector-definitions/ai-stability-ai",
          connector_definition: {
            name: "connector-definitions/ai-stability-ai",
            uid: "c86a95cc-7d32-4e22-a290-8c699f6705a4",
            id: "ai-stability-ai",
            title: "Stability AI",
            documentation_url:
              "https://www.instill.tech/docs/vdp/ai-connectors/stability-ai",
            icon: "stabilityai.svg",
            spec: {
              resource_specification: {
                $schema: "http://json-schema.org/draft-07/schema#",
                additionalProperties: false,
                properties: {
                  api_key: {
                    credential_field: true,
                    description:
                      "Fill your Stability AI API key. To find your keys, navigate to your DreamStudio's Account page.",
                    title: "API Key",
                    type: "string",
                  },
                },
                required: ["api_key"],
                title: "Stability AI Connector Spec",
                type: "object",
              },
              component_specification: {
                $schema: "http://json-schema.org/draft-07/schema#",
                allOf: [
                  {
                    if: {
                      properties: {
                        input: {
                          properties: {
                            task: {
                              const: "TASK_TEXT_TO_IMAGE",
                            },
                          },
                        },
                      },
                    },
                    then: {
                      properties: {
                        input: {
                          additionalProperties: false,
                          properties: {
                            cfg_scale: {
                              anyOf: [
                                {
                                  default: 7,
                                  example: 7,
                                  instillUpstreamType: "value",
                                  maximum: 35,
                                  minimum: 0,
                                  type: "number",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "CFG Scale",
                            },
                            clip_guidance_preset: {
                              anyOf: [
                                {
                                  default: "NONE",
                                  enum: [
                                    "FAST_BLUE",
                                    "FAST_GREEN",
                                    "NONE",
                                    "SIMPLE",
                                    "SLOW",
                                    "SLOWER",
                                    "SLOWEST",
                                  ],
                                  example: "FAST_BLUE",
                                  instillUpstreamType: "value",
                                  type: "string",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description: "",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Clip Guidance Preset",
                            },
                            engine: {
                              anyOf: [
                                {
                                  default: "stable-diffusion-xl-1024-v1-0",
                                  enum: [
                                    "stable-diffusion-xl-1024-v1-0",
                                    "stable-diffusion-xl-1024-v0-9",
                                    "stable-diffusion-v1",
                                    "stable-diffusion-v1-5",
                                    "stable-diffusion-512-v2-0",
                                    "stable-diffusion-768-v2-0",
                                    "stable-diffusion-512-v2-1",
                                    "stable-diffusion-768-v2-1",
                                    "stable-diffusion-xl-beta-v2-2-2",
                                    "stable-inpainting-v1-0",
                                    "stable-inpainting-512-v2-0",
                                  ],
                                },
                                {
                                  type: "string",
                                },
                              ],
                              description:
                                "Stability AI Engine (model) to be used.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Engine",
                            },
                            height: {
                              anyOf: [
                                {
                                  default: 512,
                                  example: 512,
                                  instillUpstreamType: "value",
                                  minimum: 128,
                                  multipleOf: 64,
                                  type: "integer",
                                  "x-go-type": "uint64",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Height of the image in pixels.  Must be in increments of 64 and pass the following validation:\n- For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576\n- For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576\n- For SDXL Beta: can be as low as 128 and as high as 896 as long as `width` is not greater than 512. If `width` is greater than 512 then this can be _at most_ 512.\n- For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152\n- For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
                              instillFormat: "integer",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Height",
                            },
                            prompts: {
                              anyOf: [
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "An array of prompts to use for generation.",
                              instillFormat: "text_array",
                              instillUpstreamTypes: ["reference"],
                              title: "Prompts",
                            },
                            sampler: {
                              anyOf: [
                                {
                                  enum: [
                                    "DDIM",
                                    "DDPM",
                                    "K_DPMPP_2M",
                                    "K_DPMPP_2S_ANCESTRAL",
                                    "K_DPM_2",
                                    "K_DPM_2_ANCESTRAL",
                                    "K_EULER",
                                    "K_EULER_ANCESTRAL",
                                    "K_HEUN",
                                    "K_LMS",
                                  ],
                                  example: "K_DPM_2_ANCESTRAL",
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
                                "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Sampler",
                            },
                            samples: {
                              anyOf: [
                                {
                                  default: 1,
                                  example: 1,
                                  instillUpstreamType: "value",
                                  maximum: 10,
                                  minimum: 1,
                                  type: "integer",
                                  "x-go-type": "uint64",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description: "Number of images to generate",
                              instillFormat: "integer",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Samples",
                            },
                            seed: {
                              anyOf: [
                                {
                                  default: 0,
                                  example: 0,
                                  instillUpstreamType: "value",
                                  maximum: 4294967295,
                                  minimum: 0,
                                  type: "integer",
                                  "x-go-type": "uint32",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Random noise seed (omit this option or use `0` for a random seed)",
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Seed",
                            },
                            steps: {
                              anyOf: [
                                {
                                  default: 50,
                                  example: 75,
                                  instillUpstreamType: "value",
                                  maximum: 150,
                                  minimum: 10,
                                  type: "integer",
                                  "x-go-type": "uint64",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description: "Number of diffusion steps to run",
                              instillFormat: "integer",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Steps",
                            },
                            style_preset: {
                              anyOf: [
                                {
                                  enum: [
                                    "enhance",
                                    "anime",
                                    "photographic",
                                    "digital-art",
                                    "comic-book",
                                    "fantasy-art",
                                    "line-art",
                                    "analog-film",
                                    "neon-punk",
                                    "isometric",
                                    "low-poly",
                                    "origami",
                                    "modeling-compound",
                                    "cinematic",
                                    "3d-model",
                                    "pixel-art",
                                    "tile-texture",
                                  ],
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
                                "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Style Preset",
                            },
                            task: {
                              const: "TASK_TEXT_TO_IMAGE",
                            },
                            weights: {
                              anyOf: [
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "An array of weights to use for generation.",
                              instillFormat: "number_array",
                              instillUpstreamTypes: ["reference"],
                              title: "Weights",
                            },
                            width: {
                              anyOf: [
                                {
                                  default: 512,
                                  example: 512,
                                  instillUpstreamType: "value",
                                  minimum: 128,
                                  multipleOf: 64,
                                  type: "integer",
                                  "x-go-type": "uint64",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Width of the image in pixels.  Must be in increments of 64 and pass the following validation:\n- For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576\n- For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576\n- For SDXL Beta: can be as low as 128 and as high as 896 as long as `height` is not greater than 512. If `height` is greater than 512 then this can be _at most_ 512.\n- For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152\n- For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
                              instillFormat: "integer",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Width",
                            },
                          },
                          required: ["prompts"],
                          title: "Data Flow",
                          type: "object",
                        },
                        metadata: {
                          title: "Metadata",
                          type: "object",
                        },
                      },
                    },
                  },
                  {
                    if: {
                      properties: {
                        input: {
                          properties: {
                            task: {
                              const: "TASK_IMAGE_TO_IMAGE",
                            },
                          },
                        },
                      },
                    },
                    then: {
                      properties: {
                        input: {
                          additionalProperties: false,
                          properties: {
                            cfg_scale: {
                              anyOf: [
                                {
                                  default: 7,
                                  example: 7,
                                  instillUpstreamType: "value",
                                  maximum: 35,
                                  minimum: 0,
                                  type: "number",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Cfg Scale",
                            },
                            clip_guidance_preset: {
                              anyOf: [
                                {
                                  default: "NONE",
                                  enum: [
                                    "FAST_BLUE",
                                    "FAST_GREEN",
                                    "NONE",
                                    "SIMPLE",
                                    "SLOW",
                                    "SLOWER",
                                    "SLOWEST",
                                  ],
                                  example: "FAST_BLUE",
                                  instillUpstreamType: "value",
                                  type: "string",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description: "",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Clip Guidance Preset",
                            },
                            engine: {
                              anyOf: [
                                {
                                  default: "stable-diffusion-xl-1024-v1-0",
                                  enum: [
                                    "stable-diffusion-xl-1024-v1-0",
                                    "stable-diffusion-xl-1024-v0-9",
                                    "stable-diffusion-v1",
                                    "stable-diffusion-v1-5",
                                    "stable-diffusion-512-v2-0",
                                    "stable-diffusion-768-v2-0",
                                    "stable-diffusion-512-v2-1",
                                    "stable-diffusion-768-v2-1",
                                    "stable-diffusion-xl-beta-v2-2-2",
                                    "stable-inpainting-v1-0",
                                    "stable-inpainting-512-v2-0",
                                  ],
                                },
                                {
                                  type: "string",
                                },
                              ],
                              description:
                                "Stability AI Engine (model) to be used.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Engine",
                            },
                            image_strength: {
                              anyOf: [
                                {
                                  default: 0.35,
                                  example: 0.4,
                                  format: "float",
                                  instillUpstreamType: "value",
                                  maximum: 1,
                                  minimum: 0,
                                  type: "number",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                'How much influence the `init_image` has on the diffusion process. Values close to `1` will yield images very similar to the `init_image` while values close to `0` will yield images wildly different than the `init_image`. The behavior of this is meant to mirror DreamStudio\'s "Image Strength" slider.  <br/> <br/> This parameter is just an alternate way to set `step_schedule_start`, which is done via the calculation `1 - image_strength`. For example, passing in an Image Strength of 35% (`0.35`) would result in a `step_schedule_start` of `0.65`.\n',
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Image Strength",
                            },
                            init_image: {
                              anyOf: [
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Image used to initialize the diffusion process, in lieu of random noise.",
                              instillFormat: "image",
                              instillUpstreamTypes: ["reference"],
                              title: "Init Image",
                            },
                            init_image_mode: {
                              anyOf: [
                                {
                                  default: "IMAGE_STRENGTH",
                                  enum: ["IMAGE_STRENGTH", "STEP_SCHEDULE"],
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
                                "Whether to use `image_strength` or `step_schedule_*` to control how much influence the `init_image` has on the result.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Init Image Mode",
                            },
                            prompts: {
                              anyOf: [
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "An array of prompts to use for generation.",
                              instillFormat: "text_array",
                              instillUpstreamTypes: ["reference"],
                              title: "Prompts",
                            },
                            sampler: {
                              anyOf: [
                                {
                                  enum: [
                                    "DDIM",
                                    "DDPM",
                                    "K_DPMPP_2M",
                                    "K_DPMPP_2S_ANCESTRAL",
                                    "K_DPM_2",
                                    "K_DPM_2_ANCESTRAL",
                                    "K_EULER",
                                    "K_EULER_ANCESTRAL",
                                    "K_HEUN",
                                    "K_LMS",
                                  ],
                                  example: "K_DPM_2_ANCESTRAL",
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
                                "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Sampler",
                            },
                            samples: {
                              anyOf: [
                                {
                                  default: 1,
                                  example: 1,
                                  instillUpstreamType: "value",
                                  maximum: 10,
                                  minimum: 1,
                                  type: "integer",
                                  "x-go-type": "uint64",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description: "Number of images to generate",
                              instillFormat: "integer",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Samples",
                            },
                            seed: {
                              anyOf: [
                                {
                                  default: 0,
                                  example: 0,
                                  instillUpstreamType: "value",
                                  maximum: 4294967295,
                                  minimum: 0,
                                  type: "integer",
                                  "x-go-type": "uint32",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Random noise seed (omit this option or use `0` for a random seed)",
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Seed",
                            },
                            step_schedule_end: {
                              anyOf: [
                                {
                                  example: 0.01,
                                  instillUpstreamType: "value",
                                  maximum: 1,
                                  minimum: 0,
                                  type: "number",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Skips a proportion of the end of the diffusion steps, allowing the init_image to influence the final generated image.  Lower values will result in more influence from the init_image, while higher values will result in more influence from the diffusion steps.",
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Step Schedule End",
                            },
                            step_schedule_start: {
                              anyOf: [
                                {
                                  default: 0.65,
                                  example: 0.4,
                                  instillUpstreamType: "value",
                                  maximum: 1,
                                  minimum: 0,
                                  type: "number",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "Skips a proportion of the start of the diffusion steps, allowing the init_image to influence the final generated image.  Lower values will result in more influence from the init_image, while higher values will result in more influence from the diffusion steps.  (e.g. a value of `0` would simply return you the init_image, where a value of `1` would return you a completely different image.)",
                              instillFormat: "number",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Step Schedule Start",
                            },
                            steps: {
                              anyOf: [
                                {
                                  default: 50,
                                  example: 75,
                                  instillUpstreamType: "value",
                                  maximum: 150,
                                  minimum: 10,
                                  type: "integer",
                                  "x-go-type": "uint64",
                                },
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description: "Number of diffusion steps to run",
                              instillFormat: "integer",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Steps",
                            },
                            style_preset: {
                              anyOf: [
                                {
                                  enum: [
                                    "enhance",
                                    "anime",
                                    "photographic",
                                    "digital-art",
                                    "comic-book",
                                    "fantasy-art",
                                    "line-art",
                                    "analog-film",
                                    "neon-punk",
                                    "isometric",
                                    "low-poly",
                                    "origami",
                                    "modeling-compound",
                                    "cinematic",
                                    "3d-model",
                                    "pixel-art",
                                    "tile-texture",
                                  ],
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
                                "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
                              instillFormat: "text",
                              instillUpstreamTypes: ["value", "reference"],
                              title: "Style Preset",
                            },
                            task: {
                              const: "TASK_IMAGE_TO_IMAGE",
                            },
                            weights: {
                              anyOf: [
                                {
                                  instillUpstreamType: "reference",
                                  pattern: "^\\{.*\\}$",
                                  type: "string",
                                },
                              ],
                              description:
                                "An array of weights to use for generation.",
                              instillFormat: "number_array",
                              instillUpstreamTypes: ["reference"],
                              title: "Weights",
                            },
                          },
                          required: ["prompts"],
                          title: "Data Flow",
                          type: "object",
                        },
                        metadata: {
                          title: "Metadata",
                          type: "object",
                        },
                      },
                    },
                  },
                ],
                properties: {
                  input: {
                    properties: {
                      task: {
                        enum: ["TASK_TEXT_TO_IMAGE", "TASK_IMAGE_TO_IMAGE"],
                        title: "Task",
                      },
                    },
                  },
                },
                title: "Stability AI Component Setting",
                type: "object",
              },
              openapi_specifications: {
                TASK_IMAGE_TO_IMAGE: {
                  info: {
                    title: "Stability AI Connector OpenAPI",
                    version: "1.0.0",
                  },
                  openapi: "3.0.0",
                  paths: {
                    "/execute": {
                      post: {
                        requestBody: {
                          content: {
                            "application/json": {
                              schema: {
                                properties: {
                                  inputs: {
                                    items: {
                                      additionalProperties: false,
                                      properties: {
                                        cfg_scale: {
                                          default: 7,
                                          description:
                                            "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
                                          example: 7,
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 35,
                                          minimum: 0,
                                          title: "Cfg Scale",
                                          type: "number",
                                        },
                                        clip_guidance_preset: {
                                          default: "NONE",
                                          enum: [
                                            "FAST_BLUE",
                                            "FAST_GREEN",
                                            "NONE",
                                            "SIMPLE",
                                            "SLOW",
                                            "SLOWER",
                                            "SLOWEST",
                                          ],
                                          example: "FAST_BLUE",
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Clip Guidance Preset",
                                          type: "string",
                                        },
                                        engine: {
                                          anyOf: [
                                            {
                                              default:
                                                "stable-diffusion-xl-1024-v1-0",
                                              enum: [
                                                "stable-diffusion-xl-1024-v1-0",
                                                "stable-diffusion-xl-1024-v0-9",
                                                "stable-diffusion-v1",
                                                "stable-diffusion-v1-5",
                                                "stable-diffusion-512-v2-0",
                                                "stable-diffusion-768-v2-0",
                                                "stable-diffusion-512-v2-1",
                                                "stable-diffusion-768-v2-1",
                                                "stable-diffusion-xl-beta-v2-2-2",
                                                "stable-inpainting-v1-0",
                                                "stable-inpainting-512-v2-0",
                                              ],
                                            },
                                            {
                                              type: "string",
                                            },
                                          ],
                                          description:
                                            "Stability AI Engine (model) to be used.",
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Engine",
                                        },
                                        image_strength: {
                                          default: 0.35,
                                          description:
                                            'How much influence the `init_image` has on the diffusion process. Values close to `1` will yield images very similar to the `init_image` while values close to `0` will yield images wildly different than the `init_image`. The behavior of this is meant to mirror DreamStudio\'s "Image Strength" slider.  <br/> <br/> This parameter is just an alternate way to set `step_schedule_start`, which is done via the calculation `1 - image_strength`. For example, passing in an Image Strength of 35% (`0.35`) would result in a `step_schedule_start` of `0.65`.\n',
                                          example: 0.4,
                                          format: "float",
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 1,
                                          minimum: 0,
                                          title: "Image Strength",
                                          type: "number",
                                        },
                                        init_image: {
                                          description:
                                            "Image used to initialize the diffusion process, in lieu of random noise.",
                                          example: "<image binary>",
                                          format: "binary",
                                          instillFormat: "image",
                                          instillUpstreamTypes: ["reference"],
                                          title: "Init Image",
                                          type: "string",
                                          "x-go-type": "[]byte",
                                        },
                                        init_image_mode: {
                                          default: "IMAGE_STRENGTH",
                                          description:
                                            "Whether to use `image_strength` or `step_schedule_*` to control how much influence the `init_image` has on the result.",
                                          enum: [
                                            "IMAGE_STRENGTH",
                                            "STEP_SCHEDULE",
                                          ],
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Init Image Mode",
                                          type: "string",
                                        },
                                        prompts: {
                                          description:
                                            "An array of prompts to use for generation.",
                                          instillFormat: "text_array",
                                          instillUpstreamTypes: ["reference"],
                                          items: {
                                            description: "The prompt itself",
                                            example: "A lighthouse on a cliff",
                                            maxLength: 2000,
                                            type: "string",
                                          },
                                          minItems: 1,
                                          title: "Prompts",
                                          type: "array",
                                        },
                                        sampler: {
                                          description:
                                            "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
                                          enum: [
                                            "DDIM",
                                            "DDPM",
                                            "K_DPMPP_2M",
                                            "K_DPMPP_2S_ANCESTRAL",
                                            "K_DPM_2",
                                            "K_DPM_2_ANCESTRAL",
                                            "K_EULER",
                                            "K_EULER_ANCESTRAL",
                                            "K_HEUN",
                                            "K_LMS",
                                          ],
                                          example: "K_DPM_2_ANCESTRAL",
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Sampler",
                                          type: "string",
                                        },
                                        samples: {
                                          default: 1,
                                          description:
                                            "Number of images to generate",
                                          example: 1,
                                          instillFormat: "integer",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 10,
                                          minimum: 1,
                                          title: "Samples",
                                          type: "integer",
                                          "x-go-type": "uint64",
                                        },
                                        seed: {
                                          default: 0,
                                          description:
                                            "Random noise seed (omit this option or use `0` for a random seed)",
                                          example: 0,
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 4294967295,
                                          minimum: 0,
                                          title: "Seed",
                                          type: "integer",
                                          "x-go-type": "uint32",
                                        },
                                        step_schedule_end: {
                                          description:
                                            "Skips a proportion of the end of the diffusion steps, allowing the init_image to influence the final generated image.  Lower values will result in more influence from the init_image, while higher values will result in more influence from the diffusion steps.",
                                          example: 0.01,
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 1,
                                          minimum: 0,
                                          title: "Step Schedule End",
                                          type: "number",
                                        },
                                        step_schedule_start: {
                                          default: 0.65,
                                          description:
                                            "Skips a proportion of the start of the diffusion steps, allowing the init_image to influence the final generated image.  Lower values will result in more influence from the init_image, while higher values will result in more influence from the diffusion steps.  (e.g. a value of `0` would simply return you the init_image, where a value of `1` would return you a completely different image.)",
                                          example: 0.4,
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 1,
                                          minimum: 0,
                                          title: "Step Schedule Start",
                                          type: "number",
                                        },
                                        steps: {
                                          default: 50,
                                          description:
                                            "Number of diffusion steps to run",
                                          example: 75,
                                          instillFormat: "integer",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 150,
                                          minimum: 10,
                                          title: "Steps",
                                          type: "integer",
                                          "x-go-type": "uint64",
                                        },
                                        style_preset: {
                                          description:
                                            "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
                                          enum: [
                                            "enhance",
                                            "anime",
                                            "photographic",
                                            "digital-art",
                                            "comic-book",
                                            "fantasy-art",
                                            "line-art",
                                            "analog-film",
                                            "neon-punk",
                                            "isometric",
                                            "low-poly",
                                            "origami",
                                            "modeling-compound",
                                            "cinematic",
                                            "3d-model",
                                            "pixel-art",
                                            "tile-texture",
                                          ],
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Style Preset",
                                          type: "string",
                                        },
                                        task: {
                                          const: "TASK_IMAGE_TO_IMAGE",
                                        },
                                        weights: {
                                          description:
                                            "An array of weights to use for generation.",
                                          instillFormat: "number_array",
                                          instillUpstreamTypes: ["reference"],
                                          items: {
                                            description:
                                              "Weight of the prompt (use negative numbers for negative prompts)",
                                            example: 0.8167237,
                                            format: "float",
                                            type: "number",
                                          },
                                          minItems: 1,
                                          title: "Weights",
                                          type: "array",
                                        },
                                      },
                                      required: ["prompts"],
                                      type: "object",
                                    },
                                    type: "array",
                                  },
                                },
                                type: "object",
                              },
                            },
                          },
                          required: true,
                        },
                        responses: {
                          "200": {
                            content: {
                              "application/json": {
                                schema: {
                                  properties: {
                                    outputs: {
                                      items: {
                                        additionalProperties: false,
                                        instillFormat: "image",
                                        properties: {
                                          images: {
                                            instillFormat: "text_array",
                                            items: {
                                              type: "string",
                                            },
                                            title: "Images",
                                            type: "array",
                                          },
                                          seeds: {
                                            instillFormat: "number_array",
                                            items: {
                                              description:
                                                "The seed associated with this image",
                                              example: 1229191277,
                                              type: "number",
                                            },
                                            title: "Seeds",
                                            type: "array",
                                          },
                                        },
                                        required: ["images", "seeds"],
                                        type: "object",
                                      },
                                      type: "array",
                                    },
                                  },
                                  type: "object",
                                },
                              },
                            },
                            description: "",
                          },
                        },
                      },
                    },
                  },
                },
                TASK_TEXT_TO_IMAGE: {
                  info: {
                    title: "Stability AI Connector OpenAPI",
                    version: "1.0.0",
                  },
                  openapi: "3.0.0",
                  paths: {
                    "/execute": {
                      post: {
                        requestBody: {
                          content: {
                            "application/json": {
                              schema: {
                                properties: {
                                  inputs: {
                                    items: {
                                      additionalProperties: false,
                                      properties: {
                                        cfg_scale: {
                                          default: 7,
                                          description:
                                            "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
                                          example: 7,
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 35,
                                          minimum: 0,
                                          title: "CFG Scale",
                                          type: "number",
                                        },
                                        clip_guidance_preset: {
                                          default: "NONE",
                                          enum: [
                                            "FAST_BLUE",
                                            "FAST_GREEN",
                                            "NONE",
                                            "SIMPLE",
                                            "SLOW",
                                            "SLOWER",
                                            "SLOWEST",
                                          ],
                                          example: "FAST_BLUE",
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Clip Guidance Preset",
                                          type: "string",
                                        },
                                        engine: {
                                          anyOf: [
                                            {
                                              default:
                                                "stable-diffusion-xl-1024-v1-0",
                                              enum: [
                                                "stable-diffusion-xl-1024-v1-0",
                                                "stable-diffusion-xl-1024-v0-9",
                                                "stable-diffusion-v1",
                                                "stable-diffusion-v1-5",
                                                "stable-diffusion-512-v2-0",
                                                "stable-diffusion-768-v2-0",
                                                "stable-diffusion-512-v2-1",
                                                "stable-diffusion-768-v2-1",
                                                "stable-diffusion-xl-beta-v2-2-2",
                                                "stable-inpainting-v1-0",
                                                "stable-inpainting-512-v2-0",
                                              ],
                                            },
                                            {
                                              type: "string",
                                            },
                                          ],
                                          description:
                                            "Stability AI Engine (model) to be used.",
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Engine",
                                        },
                                        height: {
                                          default: 512,
                                          description:
                                            "Height of the image in pixels.  Must be in increments of 64 and pass the following validation:\n- For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576\n- For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576\n- For SDXL Beta: can be as low as 128 and as high as 896 as long as `width` is not greater than 512. If `width` is greater than 512 then this can be _at most_ 512.\n- For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152\n- For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
                                          example: 512,
                                          instillFormat: "integer",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          minimum: 128,
                                          multipleOf: 64,
                                          title: "Height",
                                          type: "integer",
                                          "x-go-type": "uint64",
                                        },
                                        prompts: {
                                          description:
                                            "An array of prompts to use for generation.",
                                          instillFormat: "text_array",
                                          instillUpstreamTypes: ["reference"],
                                          items: {
                                            description: "The prompt itself",
                                            example: "A lighthouse on a cliff",
                                            maxLength: 2000,
                                            type: "string",
                                          },
                                          minItems: 1,
                                          title: "Prompts",
                                          type: "array",
                                        },
                                        sampler: {
                                          description:
                                            "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
                                          enum: [
                                            "DDIM",
                                            "DDPM",
                                            "K_DPMPP_2M",
                                            "K_DPMPP_2S_ANCESTRAL",
                                            "K_DPM_2",
                                            "K_DPM_2_ANCESTRAL",
                                            "K_EULER",
                                            "K_EULER_ANCESTRAL",
                                            "K_HEUN",
                                            "K_LMS",
                                          ],
                                          example: "K_DPM_2_ANCESTRAL",
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Sampler",
                                          type: "string",
                                        },
                                        samples: {
                                          default: 1,
                                          description:
                                            "Number of images to generate",
                                          example: 1,
                                          instillFormat: "integer",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 10,
                                          minimum: 1,
                                          title: "Samples",
                                          type: "integer",
                                          "x-go-type": "uint64",
                                        },
                                        seed: {
                                          default: 0,
                                          description:
                                            "Random noise seed (omit this option or use `0` for a random seed)",
                                          example: 0,
                                          instillFormat: "number",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 4294967295,
                                          minimum: 0,
                                          title: "Seed",
                                          type: "integer",
                                          "x-go-type": "uint32",
                                        },
                                        steps: {
                                          default: 50,
                                          description:
                                            "Number of diffusion steps to run",
                                          example: 75,
                                          instillFormat: "integer",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          maximum: 150,
                                          minimum: 10,
                                          title: "Steps",
                                          type: "integer",
                                          "x-go-type": "uint64",
                                        },
                                        style_preset: {
                                          description:
                                            "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
                                          enum: [
                                            "enhance",
                                            "anime",
                                            "photographic",
                                            "digital-art",
                                            "comic-book",
                                            "fantasy-art",
                                            "line-art",
                                            "analog-film",
                                            "neon-punk",
                                            "isometric",
                                            "low-poly",
                                            "origami",
                                            "modeling-compound",
                                            "cinematic",
                                            "3d-model",
                                            "pixel-art",
                                            "tile-texture",
                                          ],
                                          instillFormat: "text",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          title: "Style Preset",
                                          type: "string",
                                        },
                                        task: {
                                          const: "TASK_TEXT_TO_IMAGE",
                                        },
                                        weights: {
                                          description:
                                            "An array of weights to use for generation.",
                                          instillFormat: "number_array",
                                          instillUpstreamTypes: ["reference"],
                                          items: {
                                            description:
                                              "Weight of the prompt (use negative numbers for negative prompts)",
                                            example: 0.8167237,
                                            format: "float",
                                            type: "number",
                                          },
                                          minItems: 1,
                                          title: "Weights",
                                          type: "array",
                                        },
                                        width: {
                                          default: 512,
                                          description:
                                            "Width of the image in pixels.  Must be in increments of 64 and pass the following validation:\n- For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576\n- For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576\n- For SDXL Beta: can be as low as 128 and as high as 896 as long as `height` is not greater than 512. If `height` is greater than 512 then this can be _at most_ 512.\n- For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152\n- For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
                                          example: 512,
                                          instillFormat: "integer",
                                          instillUpstreamTypes: [
                                            "value",
                                            "reference",
                                          ],
                                          minimum: 128,
                                          multipleOf: 64,
                                          title: "Width",
                                          type: "integer",
                                          "x-go-type": "uint64",
                                        },
                                      },
                                      required: ["prompts"],
                                      type: "object",
                                    },
                                    type: "array",
                                  },
                                },
                                type: "object",
                              },
                            },
                          },
                          required: true,
                        },
                        responses: {
                          "200": {
                            content: {
                              "application/json": {
                                schema: {
                                  properties: {
                                    outputs: {
                                      items: {
                                        additionalProperties: false,
                                        properties: {
                                          images: {
                                            description: "",
                                            instillFormat: "text_array",
                                            items: {
                                              type: "string",
                                            },
                                            title: "images",
                                            type: "array",
                                          },
                                          seeds: {
                                            instillFormat: "number_array",
                                            items: {
                                              description:
                                                "The seed associated with this image",
                                              example: 1229191277,
                                              type: "number",
                                            },
                                            title: "Seeds",
                                            type: "array",
                                          },
                                        },
                                        required: ["images", "seeds"],
                                        type: "object",
                                      },
                                      type: "array",
                                    },
                                  },
                                  type: "object",
                                },
                              },
                            },
                            description: "",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            type: "CONNECTOR_TYPE_AI",
            tombstone: false,
            public: true,
            custom: false,
            icon_url: "",
            vendor: "stabilityAI",
            vendor_attributes: null,
          },
        },
      ],
    },
    user: "users/instill-ai",
    create_time: "2023-09-07T12:23:57.143359Z",
    update_time: "2023-09-07T14:22:23.444445Z",
    visibility: "VISIBILITY_UNSPECIFIED",
    openapi_schema: {
      info: {
        title: "Pipeline Trigger",
        version: "dev",
      },
      openapi: "3.0.0",
      paths: {
        "/trigger": {
          post: {
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      inputs: {
                        items: {
                          properties: {
                            height: {
                              description: "",
                              title: "height",
                              type: "number",
                            },
                            prompts: {
                              description: "",
                              items: {
                                type: "string",
                              },
                              title: "prompts",
                              type: "array",
                            },
                            width: {
                              description: "",
                              title: "width",
                              type: "number",
                            },
                          },
                          type: "object",
                        },
                        type: "array",
                      },
                    },
                    type: "object",
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      properties: {
                        outputs: {
                          items: {
                            properties: {
                              images: {
                                description: "",
                                instillFormat: "text_array",
                                items: {
                                  type: "string",
                                },
                                title: "images",
                                type: "array",
                              },
                            },
                            type: "object",
                          },
                          type: "array",
                        },
                      },
                      type: "object",
                    },
                  },
                },
                description: "",
              },
            },
          },
        },
        "/triggerAsync": {
          post: {
            requestBody: {
              content: {
                "application/json": {
                  schema: {
                    properties: {
                      inputs: {
                        items: {
                          properties: {
                            height: {
                              description: "",
                              title: "height",
                              type: "number",
                            },
                            prompts: {
                              description: "",
                              items: {
                                type: "string",
                              },
                              title: "prompts",
                              type: "array",
                            },
                            width: {
                              description: "",
                              title: "width",
                              type: "number",
                            },
                          },
                          type: "object",
                        },
                        type: "array",
                      },
                    },
                    type: "object",
                  },
                },
              },
              required: true,
            },
            responses: {
              "200": {
                content: {
                  "application/json": {
                    schema: {
                      properties: {
                        operation: {
                          properties: {
                            done: {
                              type: "boolean",
                            },
                            error: {
                              properties: {
                                code: {
                                  format: "int32",
                                  type: "integer",
                                },
                                details: {
                                  items: {
                                    additionalProperties: {},
                                    properties: {
                                      "@type": {
                                        type: "string",
                                      },
                                    },
                                    type: "object",
                                  },
                                  type: "array",
                                },
                                message: {
                                  type: "string",
                                },
                              },
                              type: "object",
                            },
                            metadata: {
                              additionalProperties: {},
                              properties: {
                                "@type": {
                                  type: "string",
                                },
                              },
                              type: "object",
                            },
                            name: {
                              type: "string",
                            },
                            response: {
                              additionalProperties: {},
                              properties: {
                                "@type": {
                                  type: "string",
                                },
                              },
                              type: "object",
                            },
                          },
                          type: "object",
                        },
                      },
                      type: "object",
                    },
                  },
                },
                description: "",
              },
            },
          },
        },
      },
    },
    delete_time: null,
  },
};
