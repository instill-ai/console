import * as z from "zod";
import { Meta, StoryFn } from "@storybook/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "./Form";
import { Input } from "../Input";

const meta: Meta = {
  title: "Components/NewUi/Form",
};

export default meta;

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const Template: StoryFn = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
          name="username"
          render={({ field }) => {
            return (
              <Form.Item>
                <Form.Label htmlFor={field.name}>Username</Form.Label>
                <Form.Control>
                  <Input.Root>
                    <Input.Core
                      id={field.name}
                      type="text"
                      placeholder="Hello world"
                      {...field}
                    />
                  </Input.Root>
                </Form.Control>
                <Form.Description
                  text={`Please fill in your username, here is the <a href='#'>rule</a>`}
                />
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

export const Playground: StoryFn<typeof Form> = Template.bind({});

Playground.args = {};
