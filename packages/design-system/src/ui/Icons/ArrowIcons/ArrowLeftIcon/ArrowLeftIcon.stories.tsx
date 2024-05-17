import { Meta, StoryFn } from "@storybook/react";
import ArrowLeftIcon from "./ArrowLeftIcon";

const meta: Meta<typeof ArrowLeftIcon> = {
  title: "Components/Ui/Icon/ArrowLeftIcon",
  component: ArrowLeftIcon,
};

export default meta;

const Template: StoryFn<typeof ArrowLeftIcon> = (args) => (
  <ArrowLeftIcon {...args} />
);

export const Playground: StoryFn<typeof ArrowLeftIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
