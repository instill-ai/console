import { z } from "zod";
import { Meta, StoryFn } from "@storybook/react";
import { Switch } from "./Switch";
import { Field } from "../Field";
import { Form } from "../Form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const meta: Meta = {
  title: "Components/NewUi/Switch",
};

export default meta;

const Template: StoryFn = () => {
  return (
    <Field.Root>
      <Field.Label htmlFor="hello">Dictionary Encoding</Field.Label>
      <Switch id="hello" />
      <Field.Description>This is description</Field.Description>
    </Field.Root>
  );
};

export const Playground: StoryFn<typeof Switch> = Template.bind({});

Playground.args = {};

const FormSchema = z.object({
  check: z.boolean(),
});

const WithFormTemplate: StoryFn = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      check: true,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    alert(JSON.stringify(data));
  }

  return (
    <Form.Root {...form}>
      <form
        className="flex flex-col space-y-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form.Field
          control={form.control}
          name="check"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label htmlFor={field.name}>Username</Form.Label>
                <Form.Control>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={true}
                  />
                </Form.Control>
                <Form.Description text=" Please fill in your username" />
                <Form.Message />
              </Form.Item>
            );
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </Form.Root>
  );
};

export const WithForm: StoryFn = WithFormTemplate.bind({});
