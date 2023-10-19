import { Meta, StoryFn } from "@storybook/react";
import SolidButton from "./SolidButton";

const meta: Meta<typeof SolidButton> = {
  title: "Components/Ui/Button/SolidButton",
  component: SolidButton,
};

export default meta;

const Template: StoryFn<typeof SolidButton> = (args) => (
  <SolidButton {...args}>Button</SolidButton>
);
export const Playground: StoryFn<typeof SolidButton> = Template.bind({});

Playground.args = {
  color: "primary",
};
