import { test, expect, vi } from "vitest";
import {
  getEscapedReferenceValueForReactTestingLibrary,
  render,
  screen,
  userEvent,
  within,
} from "../test/utils";
import { useInstillForm } from "./useInstillForm";
import { InstillJSONSchema } from "./type";
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
  const weights = "${start.value}";

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

  // screen.logTestingPlaygroundURL()

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
