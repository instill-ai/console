/* eslint-disable @typescript-eslint/no-explicit-any */

import { test, expect, vi } from "vitest";
import {
  getEscapedReferenceValueForReactTestingLibrary,
  render,
  screen,
  userEvent,
  within,
} from "../test/utils";
import { useInstillForm } from "./useInstillForm";
import { InstillJSONSchema } from "./types";
import { Form } from "@instill-ai/design-system";

const SimpleFormSchema: InstillJSONSchema = {
  title: "Simple Form JSON",
  type: "object",
  required: ["first_name", "last_name", "email"],
  properties: {
    first_name: {
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
      description: "The last name of the user",
      instillAcceptFormats: ["string"],
      instillShortDescription: "The last name of the user",
      instillUIOrder: 0,
      instillUpstreamTypes: ["value", "reference", "template"],
      title: "First Name",
    },
    last_name: {
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
      description: "The last name of the user",
      instillAcceptFormats: ["string"],
      instillShortDescription: "The last name of the user",
      instillUIOrder: 1,
      instillUpstreamTypes: ["value", "reference", "template"],
      title: "Last Name",
    },
    email: {
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
      description: "The email of the user",
      instillAcceptFormats: ["string"],
      instillShortDescription: "The email of the user",
      instillUIOrder: 2,
      instillUpstreamTypes: ["value", "reference", "template"],
      title: "Email ",
    },
    engine: {
      anyOf: [
        {
          default: "stable-diffusion-xl-1024-v1-0",
          enum: [
            "stable-diffusion-xl-1024-v1-0",
            "stable-diffusion-xl-1024-v0-9",
            "stable-diffusion-v1-6",
            "esrgan-v1-x2plus",
            "stable-diffusion-512-v2-1",
            "stable-diffusion-xl-beta-v2-2-2",
          ],
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
      description: "Stability AI Engine (model) to be used.",
      instillAcceptFormats: ["string"],
      instillShortDescription: "Stability AI Engine (model) to be used.",
      instillUIOrder: 3,
      instillUpstreamTypes: ["value", "reference", "template"],
      title: "Engine",
    },
  },
};

function InstillForm({
  onSubmit,
  schema,
}: {
  schema: InstillJSONSchema;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onSubmit: (data: any) => void;
}) {
  const { fields, form } = useInstillForm(schema, null);

  function handleTestSubmit(data: any) {
    onSubmit(data);
  }

  return (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(handleTestSubmit)}>
        <div className="flex flex-col gap-y-3">{fields}</div>
        <button type="submit">submit</button>
      </form>
    </Form.Root>
  );
}

test("should generate simple one layer form", async () => {
  const user = userEvent.setup();
  // Make sure the form is generated correctly
  const onSubmit = vi.fn();

  render(<InstillForm schema={SimpleFormSchema} onSubmit={onSubmit} />);

  // Check all the field's labels are rendered
  expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/engine/i)).toBeInTheDocument();

  // Check the form fields are rendered
  const firstNameField = screen.getByRole("textbox", {
    name: /first name/i,
  });
  expect(firstNameField).toBeInTheDocument();

  const lastNameField = screen.getByRole("textbox", {
    name: /last name/i,
  });
  expect(lastNameField).toBeInTheDocument();

  const emailField = screen.getByRole("textbox", {
    name: /email/i,
  });
  expect(emailField).toBeInTheDocument();

  const engineField = screen.getByRole("combobox", {
    name: /engine/i,
  });
  expect(engineField).toBeInTheDocument();

  // Check the submit button is rendered
  const submitButton = screen.getByRole("button", {
    name: /submit/i,
  });
  expect(submitButton).toBeInTheDocument();

  // Fill in the desire values
  const firstNameValue = "John";
  const lastNameValue = "Doe";
  const emailValue = "hello@instill.tech";
  const engineValue = "stable-diffusion-xl-beta-v2-2-2";

  await user.type(firstNameField, firstNameValue);
  expect(firstNameField).toHaveValue(firstNameValue);
  await user.type(lastNameField, lastNameValue);
  expect(lastNameField).toHaveValue(lastNameValue);
  await user.type(emailField, emailValue);
  expect(emailField).toHaveValue(emailValue);

  // Due to once we click the combobox, other fields' pointer-events will be set to none
  // And we need to click something again, to avoid this additional step, we better move
  // this to the end

  // Trigger the select
  await userEvent.click(engineField, {
    pointerState: await userEvent.pointer({ target: engineField }),
  });

  // Check the engine options are rendered, this need to move below the other fields
  expect(engineField).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("option", { name: "stable-diffusion-xl-1024-v1-0" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "stable-diffusion-xl-1024-v0-9" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "stable-diffusion-v1-6" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "esrgan-v1-x2plus" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "stable-diffusion-512-v2-1" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "stable-diffusion-xl-beta-v2-2-2" })
  ).toBeInTheDocument();

  // Select the last option
  await user.click(screen.getByRole("option", { name: engineValue }));
  expect(engineField).toHaveAttribute("aria-expanded", "false");
  expect(within(engineField).getByText(engineValue)).toBeInTheDocument();

  // Submit the form
  await userEvent.click(submitButton);

  // Check the onSubmit is called
  expect(onSubmit).toHaveBeenCalledWith({
    first_name: firstNameValue,
    last_name: lastNameValue,
    email: emailValue,
    engine: engineValue,
  });
});

const OneOfFormSchema: InstillJSONSchema = {
  title: "task",
  type: "object",
  oneOf: [
    {
      type: "object",
      properties: {
        task: {
          const: "TASK_TEXT_TO_IMAGE",
        },
        input: {
          type: "object",
          properties: {
            prompts: {
              anyOf: [
                {
                  instillUpstreamType: "reference",
                  pattern: "^\\{.*\\}$",
                  type: "string",
                },
              ],
              description: "An array of prompts to use for generation.",
              instillAcceptFormats: ["array:string"],
              instillShortDescription:
                "An array of prompts to use for generation.",
              instillUIOrder: 1,
              instillUpstreamTypes: ["reference"],
              title: "Prompts",
            },
          },
        },
      },
    },
    {
      type: "object",
      properties: {
        task: {
          const: "TASK_IMAGE_TO_IMAGE",
        },
        input: {
          type: "object",
          properties: {
            weights: {
              anyOf: [
                {
                  instillUpstreamType: "reference",
                  pattern: "^\\{.*\\}$",
                  type: "string",
                },
              ],
              description:
                "An array of weights to use for generation. If unspecified, the model will automatically assign a default weight of 1.0 to each prompt.",
              instillAcceptFormats: ["array:number", "array:integer"],
              instillShortDescription:
                "An array of weights to use for generation. If unspecified, the model will automatically assign a default weight of 1.0 to each prompt.",
              instillUIOrder: 0,
              instillUpstreamTypes: ["reference"],
              title: "Weights",
            },
          },
        },
      },
    },
  ],
};

test("should generate oneOf form", async () => {
  const user = userEvent.setup();
  const task = "TASK_IMAGE_TO_IMAGE";

  // We need to {{ to escape the special rule of testing library
  const weights = "${trigger.value}";

  // Make sure the form is generated correctly
  const onSubmit = vi.fn();

  render(<InstillForm schema={OneOfFormSchema} onSubmit={onSubmit} />);

  // Check the task oneOf selection is rendered
  const taskField = screen.getByRole("combobox", {
    name: /task/i,
  });
  expect(taskField).toBeInTheDocument();

  // Check the oneOf selection has default option
  // By default, the first option will be selected
  expect(taskField).toHaveAttribute("aria-expanded", "false");
  expect(within(taskField).getByText("TASK_TEXT_TO_IMAGE")).toBeInTheDocument();

  // Check the submit button is rendered
  const submitButton = screen.getByRole("button", {
    name: /submit/i,
  });
  expect(submitButton).toBeInTheDocument();

  // Trigger the select
  await userEvent.click(taskField, {
    pointerState: await userEvent.pointer({ target: taskField }),
  });

  // Check the task options are rendered
  expect(taskField).toHaveAttribute("aria-expanded", "true");
  expect(
    screen.getByRole("option", { name: "TASK_TEXT_TO_IMAGE" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "TASK_IMAGE_TO_IMAGE" })
  ).toBeInTheDocument();

  // Select the last option
  await user.click(screen.getByRole("option", { name: task }));

  // Check the task field is updated
  expect(taskField).toHaveAttribute("aria-expanded", "false");
  expect(within(taskField).getByText(task)).toBeInTheDocument();

  // Check the nested fields are rendered
  const weightsField = screen.getByRole("textbox", {
    name: /Weights/i,
  });
  expect(weightsField).toBeInTheDocument();

  // Fill in the desire values
  await user.type(
    weightsField,
    getEscapedReferenceValueForReactTestingLibrary(weights)
  );
  expect(weightsField).toHaveValue();

  // Submit the form
  await userEvent.click(submitButton);

  // Check the onSubmit is called
  expect(onSubmit).toHaveBeenCalledWith({
    task,
    input: {
      weights,
    },
  });
});

const StabilityAISchema: InstillJSONSchema = {
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
          additionalProperties: false,
          description: "Input",
          instillEditOnNodeFields: ["prompts", "engine"],
          instillUIOrder: 0,
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
              instillUIOrder: 3,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description: "Clip guidance preset",
              instillAcceptFormats: ["string"],
              instillShortDescription: "Clip guidance preset",
              instillUIOrder: 4,
              instillUpstreamTypes: ["value", "reference", "template"],
              title: "Clip Guidance Preset",
            },
            engine: {
              anyOf: [
                {
                  default: "stable-diffusion-xl-1024-v1-0",
                  enum: [
                    "stable-diffusion-xl-1024-v1-0",
                    "stable-diffusion-xl-1024-v0-9",
                    "stable-diffusion-v1-6",
                    "esrgan-v1-x2plus",
                    "stable-diffusion-512-v2-1",
                    "stable-diffusion-xl-beta-v2-2-2",
                  ],
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
              description: "Stability AI Engine (model) to be used.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Stability AI Engine (model) to be used.",
              instillUIOrder: 0,
              instillUpstreamTypes: ["value", "reference", "template"],
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
              description: "The image height",
              instillAcceptFormats: ["integer"],
              instillShortDescription: "The image height",
              instillUIOrder: 5,
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
              description: "An array of prompts to use for generation.",
              instillAcceptFormats: ["array:string"],
              instillShortDescription:
                "An array of prompts to use for generation.",
              instillUIOrder: 1,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description:
                "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
              instillUIOrder: 6,
              instillUpstreamTypes: ["value", "reference", "template"],
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
              instillAcceptFormats: ["integer"],
              instillShortDescription: "Number of images to generate",
              instillUIOrder: 7,
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "Random noise seed (omit this option or use `0` for a random seed)",
              instillUIOrder: 8,
              instillUpstreamTypes: ["value", "reference"],
              title: "Seed",
            },
            steps: {
              anyOf: [
                {
                  default: 30,
                  example: 50,
                  instillUpstreamType: "value",
                  maximum: 50,
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
              description: "Number of diffusion steps to run.",
              instillAcceptFormats: ["integer"],
              instillShortDescription: "Number of diffusion steps to run.",
              instillUIOrder: 9,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description:
                "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
              instillUIOrder: 10,
              instillUpstreamTypes: ["value", "reference", "template"],
              title: "Style Preset",
            },
            weights: {
              anyOf: [
                {
                  instillUpstreamType: "reference",
                  pattern: "^\\{.*\\}$",
                  type: "string",
                },
              ],
              description: "An array of weights to use for generation.",
              instillAcceptFormats: ["array:number", "array:integer"],
              instillShortDescription:
                "An array of weights to use for generation.",
              instillUIOrder: 2,
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
              description: "The image width",
              instillAcceptFormats: ["integer"],
              instillShortDescription: "The image width",
              instillUIOrder: 5,
              instillUpstreamTypes: ["value", "reference"],
              title: "Width",
            },
          },
          required: ["prompts", "engine"],
          title: "Input",
          type: "object",
        },
        task: {
          const: "TASK_TEXT_TO_IMAGE",
        },
      },
      type: "object",
    },
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
          additionalProperties: false,
          description: "Input",
          instillEditOnNodeFields: ["prompts", "engine"],
          instillUIOrder: 0,
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)",
              instillUIOrder: 6,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description: "Clip guidance preset",
              instillAcceptFormats: ["string"],
              instillShortDescription: "Clip guidance preset",
              instillUIOrder: 3,
              instillUpstreamTypes: ["value", "reference", "template"],
              title: "Clip Guidance Preset",
            },
            engine: {
              anyOf: [
                {
                  default: "stable-diffusion-xl-1024-v1-0",
                  enum: [
                    "stable-diffusion-xl-1024-v1-0",
                    "stable-diffusion-xl-1024-v0-9",
                    "stable-diffusion-v1-6",
                    "esrgan-v1-x2plus",
                    "stable-diffusion-512-v2-1",
                    "stable-diffusion-xl-beta-v2-2-2",
                  ],
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
              description: "Stability AI Engine (model) to be used.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Stability AI Engine (model) to be used.",
              instillUIOrder: 0,
              instillUpstreamTypes: ["value", "reference", "template"],
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "How much influence the `init_image` has on the diffusion process.",
              instillUIOrder: 5,
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
              instillAcceptFormats: ["image/*"],
              instillShortDescription:
                "Image used to initialize the diffusion process, in lieu of random noise.",
              instillUIOrder: 2,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description:
                "Whether to use `image_strength` or `step_schedule_*` to control how much influence the `init_image` has on the result.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Whether to use `image_strength` or `step_schedule_*` to control how much influence the `init_image` has on the result.",
              instillUIOrder: 7,
              instillUpstreamTypes: ["value", "reference", "template"],
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
              description: "An array of prompts to use for generation.",
              instillAcceptFormats: ["array:string"],
              instillShortDescription:
                "An array of prompts to use for generation.",
              instillUIOrder: 1,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description:
                "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Which sampler to use for the diffusion process",
              instillUIOrder: 8,
              instillUpstreamTypes: ["value", "reference", "template"],
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
              instillAcceptFormats: ["integer"],
              instillShortDescription: "Number of images to generate",
              instillUIOrder: 9,
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "Random noise seed (omit this option or use `0` for a random seed)",
              instillUIOrder: 10,
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "Skips a proportion of the end of the diffusion steps",
              instillUIOrder: 12,
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
              instillAcceptFormats: ["number", "integer"],
              instillShortDescription:
                "Skips a proportion of the start of the diffusion steps",
              instillUIOrder: 11,
              instillUpstreamTypes: ["value", "reference"],
              title: "Step Schedule Start",
            },
            steps: {
              anyOf: [
                {
                  default: 30,
                  example: 50,
                  instillUpstreamType: "value",
                  maximum: 50,
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
              description: "Number of diffusion steps to run.",
              instillAcceptFormats: ["integer"],
              instillShortDescription: "Number of diffusion steps to run.",
              instillUIOrder: 13,
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
                {
                  instillUpstreamType: "template",
                  type: "string",
                },
              ],
              description:
                "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
              instillAcceptFormats: ["string"],
              instillShortDescription:
                "Pass in a style preset to guide the image model towards a particular style.\nThis list of style presets is subject to change.",
              instillUIOrder: 14,
              instillUpstreamTypes: ["value", "reference", "template"],
              title: "Style Preset",
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
                "An array of weights to use for generation. If unspecified, the model will automatically assign a default weight of 1.0 to each prompt.",
              instillAcceptFormats: ["array:number", "array:integer"],
              instillShortDescription:
                "An array of weights to use for generation. If unspecified, the model will automatically assign a default weight of 1.0 to each prompt.",
              instillUIOrder: 2,
              instillUpstreamTypes: ["reference"],
              title: "Weights",
            },
          },
          required: ["prompts", "engine"],
          title: "Input",
          type: "object",
        },
        task: {
          const: "TASK_IMAGE_TO_IMAGE",
        },
      },
      type: "object",
    },
  ],
  title: "Stability AI Component",
  type: "object",
};

test("should generate stability ai form", async () => {
  const user = userEvent.setup();
  // Make sure the form is generated correctly
  const onSubmit = vi.fn();

  render(<InstillForm schema={StabilityAISchema} onSubmit={onSubmit} />);

  // Check all the default fields are correctly rendered
  const taskField = screen.getByRole("combobox", {
    name: /Stability AI Component/i,
  });
  expect(taskField).toBeInTheDocument();
  expect(taskField).toHaveAttribute("aria-expanded", "false");
  expect(within(taskField).getByText("TASK_TEXT_TO_IMAGE")).toBeInTheDocument();

  const promptsField = screen.getByRole("textbox", {
    name: /Prompts/i,
  });
  expect(promptsField).toBeInTheDocument();

  const weightsField = screen.getByRole("textbox", {
    name: /Weights/i,
  });
  expect(weightsField).toBeInTheDocument();

  const engineField = screen.getByRole("combobox", {
    name: /engine/i,
  });
  expect(engineField).toBeInTheDocument();

  const cfgScaleField = screen.getByRole("textbox", {
    name: /cfg scale/i,
  });
  expect(cfgScaleField).toBeInTheDocument();
  // default value on the schema is 7
  expect(cfgScaleField).toHaveValue("7");

  const clipGuidancePresetField = screen.getByRole("combobox", {
    name: /clip guidance preset/i,
  });
  expect(clipGuidancePresetField).toBeInTheDocument();
  // default value on the schema is FAST_BLUE
  expect(
    within(clipGuidancePresetField).getByText("FAST_BLUE")
  ).toBeInTheDocument();

  const widthField = screen.getByRole("textbox", {
    name: /width/i,
  });
  expect(widthField).toBeInTheDocument();

  const heightField = screen.getByRole("textbox", {
    name: /height/i,
  });
  expect(heightField).toBeInTheDocument();

  const samplerField = screen.getByRole("combobox", {
    name: /sampler/i,
  });
  expect(samplerField).toBeInTheDocument();
  expect(
    within(samplerField).getByText("K_DPM_2_ANCESTRAL")
  ).toBeInTheDocument();

  const samplesField = screen.getByRole("textbox", {
    name: /samples/i,
  });
  expect(samplesField).toBeInTheDocument();
  expect(samplesField).toHaveValue("1");

  const seedField = screen.getByRole("textbox", {
    name: /seed/i,
  });
  expect(seedField).toBeInTheDocument();

  const stepsField = screen.getByRole("textbox", {
    name: /steps/i,
  });
  expect(stepsField).toBeInTheDocument();
  expect(stepsField).toHaveValue("30");

  const stylePresetField = screen.getByRole("combobox", {
    name: /style preset/i,
  });
  expect(stylePresetField).toBeInTheDocument();

  const conditionField = screen.getByRole("textbox", {
    name: /condition/i,
  });
  expect(conditionField).toBeInTheDocument();

  // Choose another task TASK_IMAGE_TO_IMAGE
  await userEvent.click(taskField, {
    pointerState: await userEvent.pointer({ target: taskField }),
  });
  await user.click(screen.getByRole("option", { name: "TASK_IMAGE_TO_IMAGE" }));
  expect(taskField).toHaveAttribute("aria-expanded", "false");
  expect(
    within(taskField).getByText("TASK_IMAGE_TO_IMAGE")
  ).toBeInTheDocument();

  // Check the chosen task fields are correctly rendered
  expect(engineField).toBeInTheDocument();
  expect(promptsField).toBeInTheDocument();
  expect(weightsField).toBeInTheDocument();
  expect(clipGuidancePresetField).toBeInTheDocument();
  expect(
    within(clipGuidancePresetField).getByText("FAST_BLUE")
  ).toBeInTheDocument();
  expect(cfgScaleField).toBeInTheDocument();
  expect(cfgScaleField).toHaveValue("7");
  expect(samplerField).toBeInTheDocument();
  expect(
    within(samplerField).getByText("K_DPM_2_ANCESTRAL")
  ).toBeInTheDocument();
  expect(samplesField).toBeInTheDocument();
  expect(samplesField).toHaveValue("1");
  expect(seedField).toBeInTheDocument();
  expect(stepsField).toBeInTheDocument();
  expect(stepsField).toHaveValue("30");
  expect(stylePresetField).toBeInTheDocument();

  const initImageField = screen.getByRole("textbox", {
    name: /init image/i,
  });
  expect(initImageField).toBeInTheDocument();
  const imageStrengthField = screen.getByRole("textbox", {
    name: /image strength/i,
  });
  expect(imageStrengthField).toBeInTheDocument();
  expect(imageStrengthField).toHaveValue("0.35");
  const initImageModeField = screen.getByRole("combobox", {
    name: /init image mode/i,
  });
  expect(initImageModeField).toBeInTheDocument();
  const stepScheduleStartField = screen.getByRole("textbox", {
    name: /step schedule start/i,
  });
  expect(stepScheduleStartField).toBeInTheDocument();
  expect(stepScheduleStartField).toHaveValue("0.65");
  const stepScheduleEndField = screen.getByRole("textbox", {
    name: /step schedule end/i,
  });
  expect(stepScheduleEndField).toBeInTheDocument();
  expect(stepScheduleEndField).toHaveValue("0.01");

  // Fill in the desire values
  const prompts = "${trigger.prompts}";
  const weights = "${trigger.weights}";
  const engine = "stable-diffusion-xl-1024-v1-0";
  const initImage = "${trigger.image}";
  const initImageMode = "IMAGE_STRENGTH";
  const seed = "0";
  const stylePreset = "enhance";

  await user.type(
    promptsField,
    getEscapedReferenceValueForReactTestingLibrary(prompts)
  );
  expect(promptsField).toHaveValue(prompts);
  await userEvent.click(engineField, {
    pointerState: await userEvent.pointer({ target: engineField }),
  });
  await user.click(screen.getByRole("option", { name: engine }));
  expect(engineField).toHaveAttribute("aria-expanded", "false");
  expect(within(engineField).getByText(engine)).toBeInTheDocument();
  await user.type(
    weightsField,
    getEscapedReferenceValueForReactTestingLibrary(weights)
  );
  expect(weightsField).toHaveValue(weights);
  await user.type(
    initImageField,
    getEscapedReferenceValueForReactTestingLibrary(initImage)
  );
  expect(initImageField).toHaveValue(initImage);
  await userEvent.click(initImageModeField, {
    pointerState: await userEvent.pointer({ target: initImageModeField }),
  });
  await user.click(screen.getByRole("option", { name: initImageMode }));
  expect(initImageModeField).toHaveAttribute("aria-expanded", "false");
  expect(
    within(initImageModeField).getByText(initImageMode)
  ).toBeInTheDocument();
  await user.type(seedField, seed);
  expect(seedField).toHaveValue(seed);
  await userEvent.click(stylePresetField, {
    pointerState: await userEvent.pointer({ target: stylePresetField }),
  });
  await user.click(screen.getByRole("option", { name: stylePreset }));
  expect(stylePresetField).toHaveAttribute("aria-expanded", "false");
  expect(within(stylePresetField).getByText(stylePreset)).toBeInTheDocument();

  // Submit the form
  const submitButton = screen.getByRole("button", {
    name: /submit/i,
  });
  await userEvent.click(submitButton);

  // Check the onSubmit is called
  expect(onSubmit).toHaveBeenCalledWith({
    condition: null,
    task: "TASK_IMAGE_TO_IMAGE",
    input: {
      cfg_scale: "7",
      clip_guidance_preset: "FAST_BLUE",
      image_strength: "0.35",
      sampler: "K_DPM_2_ANCESTRAL",
      samples: "1",
      step_schedule_end: "0.01",
      step_schedule_start: "0.65",
      steps: "30",
      prompts,
      weights,
      engine,
      init_image: initImage,
      init_image_mode: initImageMode,
      seed,
      style_preset: stylePreset,
    },
  });
});
