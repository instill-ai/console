import { Meta, StoryFn } from "@storybook/react";
import AsyncArrowsIcon from "./AsyncArrowsIcon";

const meta: Meta<typeof AsyncArrowsIcon> = {
  title: "Components/Ui/Icon/AsyncArrowsIcon",
  component: AsyncArrowsIcon,
};

export default meta;

const Template: StoryFn<typeof AsyncArrowsIcon> = (args) => (
  <AsyncArrowsIcon {...args} />
);

export const Playground: StoryFn<typeof AsyncArrowsIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
