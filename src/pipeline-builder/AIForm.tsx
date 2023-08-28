import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { shallow } from "zustand/shallow";

import { Nullable } from "@instill-ai/toolkit";
import {
  Button,
  ComplicateIcons,
  Form,
  Icons,
  ImageClassificationIcon,
  Input,
  InstanceSegmentationIcon,
  KeypointDetectionIcon,
  ObjectDetectionIcon,
  OpticalCharacterRecognitionIcon,
  Select,
  SemanticSegmentationIcon,
  SingleSelectOption,
  Textarea,
} from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { useEffect } from "react";
import { extractReferencesFromConfiguration } from "./extractReferencesFromConfiguration";

const AISchema = z
  .object({
    connector_definition_name: z.string(),
    task: z.string(),

    // connector-definitions/ai-instill-model

    // TASK_CLASSIFICATION
    // TASK_INSTANCE_SEGMENTATION
    // TASK_KEYPOINT
    // TASK_DETECTION
    // TASK_OCR
    // TASK_SEMANTIC_SEGMENTATION
    // TASK_TEXT_GENERATION
    // TASK_TEXT_TO_IMAGE

    model_id: z.string().nullable().optional(),

    // TASK_CLASSIFICATION
    // TASK_INSTANCE_SEGMENTATION
    // TASK_KEYPOINT
    // TASK_DETECTION
    // TASK_OCR
    // TASK_SEMANTIC_SEGMENTATION
    image_base64: z.string().nullable().optional(),

    // TASK_TEXT_GENERATION
    // model_id
    prompt: z.string().nullable().optional(),
    seed: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .nullable()
      .optional(),
    output_len: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .nullable()
      .optional(),
    bad_words_list: z.string().nullable().optional(),
    stop_words_list: z.string().nullable().optional(),
    top_k: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .nullable()
      .optional(),

    // TASK_TEXT_TO_IMAGE
    // model_id
    // prompt
    cfg_scale: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .nullable()
      .optional(),
    steps: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .nullable()
      .optional(),
    samples: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .nullable()
      .optional(),
    // seed

    // connector-definitions/ai-openai

    // TASK_TEXT_GENERATION
    // prompt
    model: z.string().nullable().optional(),
    system_message: z.string().nullable().optional(),
    temperature: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .min(0, "Value must be greater than or equal to 0")
      .max(2, "Value must be less than or equal to 2")
      .nullable()
      .optional(),
    n: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .min(1, "Value must be greater than or equal to 1")
      .max(5, "Value must be less than or equal to 5")
      .nullable()
      .optional(),
    max_tokens: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .int({ message: "Value must be an integer" })
      .min(1, "Value must be greater than or equal to 1")
      .nullable()
      .optional(),

    // TASK_TEXT_EMBEDDINGS
    text: z.string().nullable().optional(),
    // model

    // TASK_SPEECH_RECOGNITION
    audio: z.string().nullable().optional(),
    // model
    // temperature
    language: z.string().nullable().optional(),
    // prompt

    // connector-definitions/ai-stability-ai

    // TASK_TEXT_TO_IMAGE
    prompts: z.string().nullable().optional(),
    weights: z.string().nullable().optional(),
    engine: z.string().nullable().optional(),
    height: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .min(128, "Value must be greater than or equal to 128")
      .multipleOf(64, "Value must be a multiple of 64")
      .nullable()
      .optional(),
    width: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .min(128, "Value must be greater than or equal to 128")
      .multipleOf(64, "Value must be a multiple of 64")
      .nullable()
      .optional(),
    // cfg_scale
    clip_guidance_preset: z.string().nullable().optional(),
    sampler: z.string().nullable().optional(),
    // samples
    // seed
    // steps
    style_preset: z.string().nullable().optional(),

    // TASK_IMAGE_TO_IMAGE
    // prompts
    weight: z.string().nullable().optional(),
    init_image: z.string().nullable().optional(),
    // engine
    init_image_mode: z.string().nullable().optional(),
    image_strength: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .min(0, "Value must be greater than or equal to 0")
      .max(1, "Value must be less than or equal to 1")
      .nullable()
      .optional(),
    step_schedule_start: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .min(0, "Value must be greater than or equal to 0")
      .max(1, "Value must be less than or equal to 1")
      .nullable()
      .optional(),
    step_schedule_end: z.coerce
      .number()
      .positive({ message: "Value must be positive" })
      .min(0, "Value must be greater than or equal to 0")
      .max(1, "Value must be less than or equal to 1")
      .nullable()
      .optional(),
    // cfg_scale
    // clip_guidance_preset
    // sampler
    // samples
    // seed
    // steps
    // style_preset
  })
  .superRefine((state, ctx) => {
    if (
      state.connector_definition_name ===
      "connector-definitions/ai-instill-model"
    ) {
      if (!state.model_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Model ID is required",
          path: ["model_id"],
        });
      }

      if (
        state.task === "TASK_CLASSIFICATION" ||
        state.task === "TASK_INSTANCE_SEGMENTATION" ||
        state.task === "TASK_KEYPOINT" ||
        state.task === "TASK_DETECTION" ||
        state.task === "TASK_OCR" ||
        state.task === "TASK_SEMANTIC_SEGMENTATION"
      ) {
        if (!state.image_base64) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "image_base64 is required",
            path: ["image_base64"],
          });
        }
      }

      if (state.task === "TASK_TEXT_GENERATION") {
        if (!state.prompt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "prompt is required",
            path: ["prompt"],
          });
        }

        if (!state.output_len) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "output_len is required",
            path: ["output_len"],
          });
        }

        if (!state.bad_words_list) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "bad_words_list is required",
            path: ["bad_words_list"],
          });
        }

        if (!state.stop_words_list) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "stop_words_list is required",
            path: ["stop_words_list"],
          });
        }

        if (!state.top_k) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "top_k is required",
            path: ["top_k"],
          });
        }

        if (!state.seed) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "seed is required",
            path: ["seed"],
          });
        }
      }

      if (state.task === "TASK_TEXT_TO_IMAGE") {
        if (!state.prompt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "prompt is required",
            path: ["prompt"],
          });
        }

        if (!state.cfg_scale) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "cfg_scale is required",
            path: ["cfg_scale"],
          });
        }

        if (!state.steps) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "steps is required",
            path: ["steps"],
          });
        }

        if (!state.samples) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "samples is required",
            path: ["samples"],
          });
        }

        if (!state.seed) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "seed is required",
            path: ["seed"],
          });
        }
      }
    }

    if (state.connector_definition_name === "connector-definitions/ai-openai") {
      if (!state.task) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "task is required",
          path: ["task"],
        });
      }

      if (state.task === "TASK_TEXT_GENERATION") {
        if (!state.prompt) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "prompt is required",
            path: ["prompt"],
          });
        }

        if (!state.model) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "model is required",
            path: ["model"],
          });
        }
      }

      if (state.task === "TASK_TEXT_EMBEDDINGS") {
        if (!state.text) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "text is required",
            path: ["text"],
          });
        }

        if (!state.model) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "model is required",
            path: ["model"],
          });
        }
      }

      if (state.task === "TASK_SPEECH_RECOGNITION") {
        if (!state.audio) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "audio is required",
            path: ["audio"],
          });
        }

        if (!state.model) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "model is required",
            path: ["model"],
          });
        }
      }
    }

    if (
      state.connector_definition_name ===
      "connector-definitions/ai-stability-ai"
    ) {
      if (!state.task) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "task is required",
          path: ["task"],
        });
      }

      if (state.task === "TASK_TEXT_TO_IMAGE") {
        if (!state.prompts) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "prompts is required",
            path: ["prompts"],
          });
        }

        if (!state.engine) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "engine is required",
            path: ["engine"],
          });
        }
      }

      if (state.task === "TASK_IMAGE_TO_IMAGE") {
        if (!state.prompts) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "prompts is required",
            path: ["prompts"],
          });
        }

        if (!state.engine) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "engine is required",
            path: ["engine"],
          });
        }

        if (!state.init_image) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "init_image is required",
            path: ["init_image"],
          });
        }
      }
    }
  });

export type AIFormProps = {
  disabledAll?: boolean;
  connector_definition_name: string;
  configuration: Record<string, any>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  updateNodes: state.updateNodes,
});

export const AIForm = (props: AIFormProps) => {
  const { configuration, disabledAll, connector_definition_name } = props;

  const selectedConnectorNodeId = usePipelineBuilderStore(
    (state) => state.selectedConnectorNodeId
  );

  const { updateNodes } = usePipelineBuilderStore(
    pipelineBuilderSelector,
    shallow
  );

  const form = useForm<z.infer<typeof AISchema>>({
    resolver: zodResolver(AISchema),
    defaultValues: {
      connector_definition_name,
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset({ ...configuration, connector_definition_name });
  }, [configuration, connector_definition_name, reset]);

  function onSubmit(data: z.infer<typeof AISchema>) {
    updateNodes((nodes) => {
      return nodes.map((node) => {
        if (
          node.id === selectedConnectorNodeId &&
          node.data.nodeType === "connector"
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              component: {
                ...node.data.component,
                configuration: data,
              },
            },
          };
        }

        return node;
      });
    });

    const references = extractReferencesFromConfiguration(data);

    console.log(references);
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex w-full flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="task"
            render={({ field }) => {
              let tasks: SingleSelectOption[] = [];

              switch (connector_definition_name) {
                case "connector-definitions/ai-instill-model":
                  tasks = [
                    {
                      label: "Classification",
                      value: "TASK_CLASSIFICATION",
                      startIcon: (
                        <ImageClassificationIcon
                          width="w-5"
                          height="h-5"
                          position="my-auto"
                          color="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Instance Segmentation",
                      value: "TASK_INSTANCE_SEGMENTATION",
                      startIcon: (
                        <InstanceSegmentationIcon
                          width="w-5"
                          height="h-5"
                          position="my-auto"
                          color="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Keypoint",
                      value: "TASK_KEYPOINT",
                      startIcon: (
                        <KeypointDetectionIcon
                          width="w-5"
                          height="h-5"
                          position="my-auto"
                          color="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Object Detection",
                      value: "TASK_DETECTION",
                      startIcon: (
                        <ObjectDetectionIcon
                          width="w-5"
                          height="h-5"
                          position="my-auto"
                          color="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "OCR",
                      value: "TASK_OCR",
                      startIcon: (
                        <OpticalCharacterRecognitionIcon
                          width="w-5"
                          height="h-5"
                          position="my-auto"
                          color="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Semantic Segmentation",
                      value: "TASK_SEMANTIC_SEGMENTATION",
                      startIcon: (
                        <SemanticSegmentationIcon
                          width="w-5"
                          height="h-5"
                          position="my-auto"
                          color="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Text Generation",
                      value: "TASK_TEXT_GENERATION",
                      startIcon: (
                        <ComplicateIcons.TextGeneration
                          className="my-auto h-5 w-5"
                          fillAreaColor="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Text to Image",
                      value: "TASK_TEXT_TO_IMAGE",
                      startIcon: (
                        <ComplicateIcons.TextToImage
                          className="my-auto h-5 w-5"
                          fillAreaColor="fill-semantic-fg-secondary"
                        />
                      ),
                    },
                  ];
                  break;
                case "connector-definitions/ai-openai":
                  tasks = [
                    {
                      label: "Text Generation",
                      value: "TASK_TEXT_GENERATION",
                      startIcon: (
                        <ComplicateIcons.TextGeneration
                          className="my-auto h-5 w-5"
                          fillAreaColor="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Text Embeddings",
                      value: "TASK_TEXT_EMBEDDINGS",
                      startIcon: (
                        <ComplicateIcons.TextEmbedding
                          className="my-auto h-5 w-5"
                          pathColor="stroke-semantic-fg-primary"
                          fillAreaColor="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Speech Recognition",
                      value: "TASK_SPEECH_RECOGNITION",
                      startIcon: (
                        <Icons.SpeechRecognition className="my-auto h-5 w-5 stroke-semantic-fg-primary" />
                      ),
                    },
                  ];
                  break;
                case "connector-definitions/ai-stability-ai":
                  tasks = [
                    {
                      label: "Text to Image",
                      value: "TASK_TEXT_TO_IMAGE",
                      startIcon: (
                        <ComplicateIcons.TextToImage
                          className="my-auto h-5 w-5"
                          fillAreaColor="fill-semantic-fg-primary"
                        />
                      ),
                    },
                    {
                      label: "Image to Image",
                      value: "TASK_IMAGE_TO_IMAGE",
                      startIcon: (
                        <ComplicateIcons.ImageToImage
                          className="my-auto h-5 w-5"
                          pathColor="stroke-semantic-fg-primary"
                        />
                      ),
                    },
                  ];
              }

              return (
                <Form.Item>
                  <Form.Label>Task *</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full">
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {tasks.map((task) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={task.label}
                          value={task.value}
                        >
                          <div className="flex flex-row gap-x-2">
                            {task.startIcon}
                            <p className="my-auto">{task.label}</p>
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>AI task type.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          {/* 
            connector-definitions/ai-instill-model
          */}

          <Form.Field
            control={form.control}
            name="image_base64"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-instill-model" &&
                form.watch("task") !== "TASK_TEXT_GENERATION" &&
                form.watch("task") !== "TASK_TEXT_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>image_base64</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    ID of the Instill Model model to be used.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="model_id"
            render={({ field }) => {
              return (
                <Form.Item
                  className={
                    connector_definition_name ===
                    "connector-definitions/ai-instill-model"
                      ? ""
                      : "hidden"
                  }
                >
                  <Form.Label>Model ID</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="prompt"
            render={({ field }) => {
              let display = false;
              let description: Nullable<string> = null;

              switch (connector_definition_name) {
                case "connector-definitions/ai-instill-model":
                  if (
                    form.watch("task") === "TASK_TEXT_GENERATION" ||
                    form.watch("task") === "TASK_TEXT_TO_IMAGE"
                  ) {
                    display = true;
                  }
                  break;
                case "connector-definitions/ai-openai":
                  if (form.watch("task") === "TASK_TEXT_GENERATION") {
                    display = true;
                  }

                  if (form.watch("task") === "TASK_SPEECH_RECOGNITION") {
                    display = true;
                    description =
                      "An optional text to guide the model's style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.\n";
                  }
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>prompt</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="output_len"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-instill-model" &&
                form.watch("task") === "TASK_TEXT_GENERATION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>output_len</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="bad_words_list"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-instill-model" &&
                form.watch("task") === "TASK_TEXT_GENERATION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>bad_words_list</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="stop_words_list"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-instill-model" &&
                form.watch("task") === "TASK_TEXT_GENERATION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>stop_words_list</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="top_k"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-instill-model" &&
                form.watch("task") === "TASK_TEXT_GENERATION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>top_k</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="seed"
            render={({ field }) => {
              let display = false;
              let description: Nullable<string> = null;

              switch (connector_definition_name) {
                case "connector-definitions/ai-instill-model":
                  if (
                    form.watch("task") === "TASK_TEXT_GENERATION" ||
                    form.watch("task") === "TASK_TEXT_TO_IMAGE"
                  ) {
                    display = true;
                  }
                  break;
                case "connector-definitions/ai-stability-ai":
                  display = true;
                  description =
                    "Random noise seed (omit this option or use `0` for a random seed)";
                  break;
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>seed</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="cfg_scale"
            render={({ field }) => {
              let display = false;
              let description: Nullable<string> = null;

              switch (connector_definition_name) {
                case "connector-definitions/ai-instill-model":
                  if (form.watch("task") === "TASK_TEXT_TO_IMAGE") {
                    display = true;
                  }
                  break;
                case "connector-definitions/ai-stability-ai":
                  if (form.watch("task") === "TASK_TEXT_TO_IMAGE") {
                    display = true;
                    description =
                      "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)";
                  }

                  if (form.watch("task") === "TASK_IMAGE_TO_IMAGE") {
                    display = true;
                    description =
                      "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)";
                  }
                  break;
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>cfg_scale</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="steps"
            render={({ field }) => {
              let display = false;
              let description: Nullable<string> = null;

              switch (connector_definition_name) {
                case "connector-definitions/ai-instill-model":
                  if (form.watch("task") === "TASK_TEXT_TO_IMAGE") {
                    display = true;
                  }
                  break;
                case "connector-definitions/ai-stability-ai":
                  display = true;
                  description = "Number of diffusion steps to run";
                  break;
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>steps</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="samples"
            render={({ field }) => {
              let display = false;
              let description: Nullable<string> = null;

              switch (connector_definition_name) {
                case "connector-definitions/ai-instill-model":
                  if (form.watch("task") === "TASK_TEXT_TO_IMAGE") {
                    display = true;
                  }
                  break;
                case "connector-definitions/ai-stability-ai":
                  if (form.watch("task") === "TASK_TEXT_TO_IMAGE") {
                    display = true;
                    description = "Number of images to generate";
                  }
                  break;
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>samples</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          {/* 
            connector-definitions/ai-openai
          */}

          <Form.Field
            control={form.control}
            name="model"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" && form.watch("task");

              let models: string[] = [];
              let description: Nullable<string> = null;

              switch (form.watch("task")) {
                case "TASK_TEXT_GENERATION":
                  models = [
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
                  ];
                  description =
                    "ID of the model to use. See the [model endpoint compatibility](/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.";
                  break;
                case "TASK_TEXT_EMBEDDINGS":
                  models = ["text-embedding-ada-002"];
                  description =
                    "ID of the model to use. You can use the [List models](/docs/api-reference/models/list) API to see all of your available models, or see our [Model overview](/docs/models/overview) for descriptions of them.\n";
                  break;
                case "TASK_SPEECH_RECOGNITION":
                  models = ["whisper-1"];
                  description =
                    "ID of the model to use. Only `whisper-1` is currently available.\n";
                  break;
                default:
                  models = [];
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>Model *</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {models.map((model) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={model}
                          value={model}
                        >
                          <p className="my-auto">{model}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="system_message"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" &&
                form.watch("task") === "TASK_TEXT_GENERATION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>system_message</Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      disabled={disabledAll}
                    />
                  </Form.Control>
                  <Form.Description>
                    The system message helps set the behavior of the assistant.
                    For example, you can modify the personality of the assistant
                    or provide specific instructions about how it should behave
                    throughout the conversation. By default, the model\u2019s
                    behavior is using a generic message as &quot;You are a
                    helpful assistant.&quot;
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="temperature"
            render={({ field }) => {
              let display = false;

              switch (connector_definition_name) {
                case "connector-definitions/ai-openai":
                  if (
                    form.watch("task") === "TASK_TEXT_GENERATION" ||
                    form.watch("task") === "TASK_SPEECH_RECOGNITION"
                  ) {
                    display = true;
                  }
                  break;
              }

              let description: Nullable<string> = null;

              switch (form.watch("task")) {
                case "TASK_TEXT_GENERATION":
                  description =
                    "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.\n\nWe generally recommend altering this or `top_p` but not both.\n";
                  break;
                case "TASK_SPEECH_RECOGNITION":
                  description =
                    "The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.\n";
                  break;
              }

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>temperature</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>{description}</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="n"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" &&
                form.watch("task") === "TASK_TEXT_GENERATION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>n</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    How many chat completion choices to generate for each input
                    message.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="max_tokens"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" &&
                form.watch("task") === "TASK_TEXT_GENERATION";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>max_tokens</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    The maximum number of tokens to generate in the chat
                    completion. If it is not set, meaning no maximum number. The
                    total length of input tokens and generated tokens is limited
                    by the model&apos;s context length.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="text"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" &&
                form.watch("task") === "TASK_TEXT_EMBEDDINGS";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>text</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>

                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="audio"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" &&
                form.watch("task") === "TASK_SPEECH_RECOGNITION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>audio</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    The audio file object (not file name) to transcribe, in one
                    of these formats: mp3, mp4, mpeg, mpga, m4a, wav, or webm.\n
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="language"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-openai" &&
                form.watch("task") === "TASK_SPEECH_RECOGNITION";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>language</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    The language of the input audio. Supplying the input
                    language in
                    [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
                    format will improve accuracy and latency.\n
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="prompts"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                "connector-definitions/ai-stability-ai";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>prompts</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    An array of prompts to use for generation.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="weights"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                "connector-definitions/ai-stability-ai";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>weights</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    An array of weights to use for generation.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="engine"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                "connector-definitions/ai-stability-ai";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>Engine</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {[
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
                      ].map((engine) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={engine}
                          value={engine}
                        >
                          <p className="my-auto">{engine}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    Stability AI Engine (model) to be used.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="height"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_TEXT_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>height</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    An array of weights to use for generation.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="width"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_TEXT_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>width</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    An array of weights to use for generation.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="clip_guidance_preset"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                "connector-definitions/ai-stability-ai";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>clip_guidance_preset</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {[
                        "FAST_BLUE",
                        "FAST_GREEN",
                        "NONE",
                        "SIMPLE",
                        "SLOW",
                        "SLOWER",
                        "SLOWEST",
                      ].map((engine) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={engine}
                          value={engine}
                        >
                          <p className="my-auto">{engine}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="sampler"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                "connector-definitions/ai-stability-ai";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>sampler</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {[
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
                      ].map((engine) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={engine}
                          value={engine}
                        >
                          <p className="my-auto">{engine}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    Which sampler to use for the diffusion process. If this
                    value is omitted we&apos;ll automatically select an
                    appropriate sampler for you.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="style_preset"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                "connector-definitions/ai-stability-ai";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>style_preset</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {[
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
                      ].map((engine) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={engine}
                          value={engine}
                        >
                          <p className="my-auto">{engine}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    Pass in a style preset to guide the image model towards a
                    particular style.\nThis list of style presets is subject to
                    change.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="init_image"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_IMAGE_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>init_image</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Image used to initialize the diffusion process, in lieu of
                    random noise.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="init_image_mode"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_IMAGE_TO_IMAGE";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>style_preset</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger>
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {["IMAGE_STRENGTH", "STEP_SCHEDULE"].map((mode) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={mode}
                          value={mode}
                        >
                          <p className="my-auto">{mode}</p>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>
                    Whether to use `image_strength` or `step_schedule_*` to
                    control how much influence the `init_image` has on the
                    result.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="image_strength"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_IMAGE_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>image_strength</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    How much influence the `init_image` has on the diffusion
                    process. Values close to `1` will yield images very similar
                    to the `init_image` while values close to `0` will yield
                    images wildly different than the `init_image`. The behavior
                    of this is meant to mirror DreamStudio&apos;s &quot;Image
                    Strength&quot; slider. <br /> <br /> This parameter is just
                    an alternate way to set `step_schedule_start`, which is done
                    via the calculation `1 - image_strength`. For example,
                    passing in an Image Strength of 35% (`0.35`) would result in
                    a `step_schedule_start` of `0.65`.\n
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="step_schedule_start"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_IMAGE_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>step_schedule_start</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Skips a proportion of the start of the diffusion steps,
                    allowing the init_image to influence the final generated
                    image. Lower values will result in more influence from the
                    init_image, while higher values will result in more
                    influence from the diffusion steps. (e.g. a value of `0`
                    would simply return you the init_image, where a value of `1`
                    would return you a completely different image.)
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="step_schedule_end"
            render={({ field }) => {
              const display =
                connector_definition_name ===
                  "connector-definitions/ai-stability-ai" &&
                form.watch("task") === "TASK_IMAGE_TO_IMAGE";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>step_schedule_end</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="number"
                        value={field.value ?? undefined}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Skips a proportion of the end of the diffusion steps,
                    allowing the init_image to influence the final generated
                    image. Lower values will result in more influence from the
                    init_image, while higher values will result in more
                    influence from the diffusion steps.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>

        <div className="flex w-full flex-row-reverse gap-x-4">
          <Button
            type="submit"
            variant="secondaryColour"
            size="lg"
            className="gap-x-2"
          >
            Save
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
