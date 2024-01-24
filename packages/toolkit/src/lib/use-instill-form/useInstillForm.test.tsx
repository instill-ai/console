import { test, expect, vi } from "vitest";
import { render, screen, userEvent } from "../test/utils";
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
  // Make sure the form is generated correctly
  const onSubmit = vi.fn();

  render(<InstillForm schema={SimpleFormSchema} onSubmit={onSubmit} />);

  // Check all the field's labels are rendered

  expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

  // Check the submit button is rendered
  expect(screen.getByText(/submit/i)).toBeInTheDocument();

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

  // Fill in the desire values
  const firstNameValue = "John";
  const lastNameValue = "Doe";
  const emailValue = "hello@instill.tech";

  await userEvent.type(firstNameField, firstNameValue);
  expect(firstNameField).toHaveValue(firstNameValue);
  await userEvent.type(lastNameField, lastNameValue);
  expect(lastNameField).toHaveValue(lastNameValue);
  await userEvent.type(emailField, emailValue);
  expect(emailField).toHaveValue(emailValue);

  // Submit the form
  await userEvent.click(screen.getByText(/submit/i));

  // Check the onSubmit is called
  expect(onSubmit).toHaveBeenCalledWith({
    first_name: firstNameValue,
    last_name: lastNameValue,
    email: emailValue,
  });
});
