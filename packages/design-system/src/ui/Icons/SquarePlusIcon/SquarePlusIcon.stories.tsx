import { Meta, StoryFn } from "@storybook/react";
import SquarePlusIcon from "./SquarePlusIcon";

const meta: Meta<typeof SquarePlusIcon> = {
  title: "Components/Ui/Icon/SquarePlusIcon",
  component: SquarePlusIcon,
};

export default meta;

const Template: StoryFn<typeof SquarePlusIcon> = (args) => (
  <SquarePlusIcon {...args} />
);

export const Playground: StoryFn<typeof SquarePlusIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
