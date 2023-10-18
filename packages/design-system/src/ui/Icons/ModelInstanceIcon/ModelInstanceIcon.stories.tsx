import { Meta, StoryFn } from "@storybook/react";
import ModelInstanceIcon from "./ModelInstanceIcon";

const meta: Meta<typeof ModelInstanceIcon> = {
  title: "Components/Ui/Icon/ModelInstanceIcon",
  component: ModelInstanceIcon,
};

export default meta;

const Template: StoryFn<typeof ModelInstanceIcon> = (args) => (
  <ModelInstanceIcon {...args} />
);

export const Playground: StoryFn<typeof ModelInstanceIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
