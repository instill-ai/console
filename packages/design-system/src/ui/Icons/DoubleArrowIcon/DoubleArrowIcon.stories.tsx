import { Meta, StoryFn } from "@storybook/react";
import DoubleArrowIcon from "./DoubleArrowIcon";

const meta: Meta<typeof DoubleArrowIcon> = {
  title: "Components/Ui/Icon/DoubleArrowIcon",
  component: DoubleArrowIcon,
};

export default meta;

const Template: StoryFn<typeof DoubleArrowIcon> = (args) => (
  <DoubleArrowIcon {...args} />
);

export const Playground: StoryFn<typeof DoubleArrowIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
