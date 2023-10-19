import { Meta, StoryFn } from "@storybook/react";
import TensorFlowIcon from "./TensorFlowIcon";

const meta: Meta<typeof TensorFlowIcon> = {
  title: "Components/Ui/Icon/TensorFlowIcon",
  component: TensorFlowIcon,
};

export default meta;

const Template: StoryFn<typeof TensorFlowIcon> = (args) => (
  <TensorFlowIcon {...args} />
);

export const Playground: StoryFn<typeof TensorFlowIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
