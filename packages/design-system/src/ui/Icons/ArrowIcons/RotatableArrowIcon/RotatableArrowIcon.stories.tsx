import { Meta, StoryFn } from "@storybook/react";
import RotatableArrowIcon from "./RotatableArrowIcon";

const meta: Meta<typeof RotatableArrowIcon> = {
  title: "Components/Ui/Icon/RotatableArrowIcon",
  component: RotatableArrowIcon,
};

export default meta;

const Template: StoryFn<typeof RotatableArrowIcon> = (args) => (
  <RotatableArrowIcon {...args} />
);

export const Playground: StoryFn<typeof RotatableArrowIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
  rotate: "rotate-45",
};

export const UseStyle: StoryFn<typeof RotatableArrowIcon> = Template.bind({});

UseStyle.args = {
  style: {
    width: "30px",
    height: "30px",
  },
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
  rotate: "rotate-45",
};
