import * as React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Textarea } from "./Textarea";
import { Field } from "../Field";

const meta: Meta<typeof Textarea> = {
  title: "Components/NewUi/Textarea",
  component: Textarea,
};

export default meta;

const Template: StoryFn<typeof Textarea> = () => {
  const [value, setValue] = React.useState("");
  return (
    <Field.Root>
      <Field.Label>Label</Field.Label>
      <Textarea
        placeholder="Input..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Field.Description>This is description</Field.Description>
    </Field.Root>
  );
};

export const Playground: StoryFn<typeof Textarea> = Template.bind({});

Playground.args = {};
