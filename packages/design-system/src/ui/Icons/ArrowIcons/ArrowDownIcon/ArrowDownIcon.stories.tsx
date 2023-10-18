import { Meta, StoryFn } from "@storybook/react";
import ArrowDownIcon from "./ArrowDownIcon";

const meta: Meta<typeof ArrowDownIcon> = {
  title: "Components/Ui/Icon/ArrowDownIcon",
  component: ArrowDownIcon,
};

export default meta;

const Template: StoryFn<typeof ArrowDownIcon> = (args) => (
  <ArrowDownIcon {...args} />
);

export const Playground: StoryFn<typeof ArrowDownIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
