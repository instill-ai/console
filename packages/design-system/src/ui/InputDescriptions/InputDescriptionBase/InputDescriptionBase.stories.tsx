import { Meta, StoryFn } from "@storybook/react";
import { InputDescriptionBase } from "./InputDescriptionBase";

const meta: Meta<typeof InputDescriptionBase> = {
  title: "Components/Ui/Input/InputDescriptionBase",
  component: InputDescriptionBase,
};

export default meta;

const Template: StoryFn<typeof InputDescriptionBase> = (args) => (
  <InputDescriptionBase {...args}>Playground label</InputDescriptionBase>
);

export const Playground: StoryFn<typeof InputDescriptionBase> = Template.bind(
  {}
);

Playground.args = {
  description: "this is description",
  descriptionFontFamily: "font-mono",
  descriptionFontSize: "text-xs",
  descriptionLineHeight: "leading-[15.6px]",
  descriptionFontWeight: "font-normal",
  descriptionTextColor: "text-semantic-node-disconnected-default-stroke",
  descriptionWidth: "w-full",
  descriptionLinkTextColor: "text-instillBlue50",
  descriptionLinkTextDecoration: "underline",
};
