import { Meta, StoryFn } from "@storybook/react";
import ArrowRightIcon from "./ArrowRightIcon";

const meta: Meta<typeof ArrowRightIcon> = {
  title: "Components/Ui/Icon/ArrowRightIcon",
  component: ArrowRightIcon,
};

export default meta;

const Template: StoryFn<typeof ArrowRightIcon> = (args) => (
  <ArrowRightIcon {...args} />
);

export const Playground: StoryFn<typeof ArrowRightIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
