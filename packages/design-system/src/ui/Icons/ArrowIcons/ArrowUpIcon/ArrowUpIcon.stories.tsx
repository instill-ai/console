import { Meta, StoryFn } from "@storybook/react";
import ArrowUpIcon from "./ArrowUpIcon";

const meta: Meta<typeof ArrowUpIcon> = {
  title: "Components/Ui/Icon/ArrowUpIcon",
  component: ArrowUpIcon,
};

export default meta;

const Template: StoryFn<typeof ArrowUpIcon> = (args) => (
  <ArrowUpIcon {...args} />
);

export const Playground: StoryFn<typeof ArrowUpIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
