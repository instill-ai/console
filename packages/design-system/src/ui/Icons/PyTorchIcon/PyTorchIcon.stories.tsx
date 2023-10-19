import { Meta, StoryFn } from "@storybook/react";
import PyTorchIcon from "./PyTorchIcon";

const meta: Meta<typeof PyTorchIcon> = {
  title: "Components/Ui/Icon/PyTorchIcon",
  component: PyTorchIcon,
};

export default meta;

const Template: StoryFn<typeof PyTorchIcon> = (args) => (
  <PyTorchIcon {...args} />
);

export const Playground: StoryFn<typeof PyTorchIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
