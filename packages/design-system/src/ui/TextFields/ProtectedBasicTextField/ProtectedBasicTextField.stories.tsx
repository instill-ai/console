import { Meta, StoryFn } from "@storybook/react";
import * as React from "react";
import { ProtectedBasicTextField } from "./ProtectedBasicTextField";

const meta: Meta<typeof ProtectedBasicTextField> = {
  title: "Components/Ui/Input/ProtectedBasicTextField",
  component: ProtectedBasicTextField,
};

export default meta;

const Template: StoryFn<typeof ProtectedBasicTextField> = (args) => {
  const [value, setValue] = React.useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <ProtectedBasicTextField
      {...args}
      id="protected-text-field-playground"
      label="protected-text-field-playground"
      description="this is a description for protected text field <a href='#'>setup guide</a>"
      value={value}
      onChange={onChange}
    />
  );
};

export const Playground: StoryFn<typeof ProtectedBasicTextField> =
  Template.bind({});

Playground.args = {
  required: true,
  disabled: false,
  readOnly: false,
  placeholder: "placeholder",
  additionalMessageOnLabel: "text label",
};
