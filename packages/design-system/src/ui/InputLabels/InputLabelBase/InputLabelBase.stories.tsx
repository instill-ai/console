import { Meta, StoryFn } from "@storybook/react";
import InputLabelBase from "./InputLabelBase";

const meta: Meta<typeof InputLabelBase> = {
  title: "Components/Base/Input/InputLabelBase",
  component: InputLabelBase,
};

export default meta;

const Template: StoryFn<typeof InputLabelBase> = (args) => {
  return <InputLabelBase {...args} />;
};

export const Playground: StoryFn<typeof InputLabelBase> = Template.bind({});

Playground.args = {
  labelFontFamily: "font-sans",
  labelFontSize: "text-base",
  labelFontWeight: "font-normal",
  labelTextColor: "text-semantic-node-disconnected-default-stroke",
  labelLineHeight: "leading-[28px]",
  messageFontSize: "text-xs",
  messageTextColor: "text-instillGrey70",
  messageFontFamily: "font-sans",
  messageFontWeight: "font-normal",
  messageLineHeight: "",
  htmlFor: "default",
  required: false,
  label: "Playground label",
  message: null,
};
