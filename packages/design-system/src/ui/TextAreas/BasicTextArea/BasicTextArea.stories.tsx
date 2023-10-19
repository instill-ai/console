import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import { BasicTextArea } from "./BasicTextArea";

const meta: Meta<typeof BasicTextArea> = {
  title: "Components/Ui/Input/BasicTextArea",
  component: BasicTextArea,
};

export default meta;

const Template: StoryFn<typeof BasicTextArea> = (args) => {
  const [value, setValue] = React.useState("");

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <BasicTextArea
      {...args}
      id="text-field-playground"
      label="Playground"
      placeholder="hello"
      description="this is a description for basic textarea <a href='#'>setup guide</a>"
      autoComplete="off"
      onChange={onChange}
      value={value}
    />
  );
};

export const Playground: StoryFn<typeof BasicTextArea> = Template.bind({});

Playground.args = {
  required: true,
  disabled: false,
  readOnly: false,
  additionalMessageOnLabel: "text label",
};
