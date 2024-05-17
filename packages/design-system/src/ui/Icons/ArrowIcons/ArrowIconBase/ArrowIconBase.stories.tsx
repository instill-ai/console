import { Meta, StoryFn } from "@storybook/react";
import ArrowIconBase from "./ArrowIconBase";

const meta: Meta<typeof ArrowIconBase> = {
  title: "Components/Ui/Icon/ArrowIconBase",
  component: ArrowIconBase,
};

export default meta;

const Template: StoryFn<typeof ArrowIconBase> = (args) => (
  <ArrowIconBase {...args} />
);

export const Playground: StoryFn<typeof ArrowIconBase> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
