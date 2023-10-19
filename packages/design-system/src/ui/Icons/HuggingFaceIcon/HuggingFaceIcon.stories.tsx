import { Meta, StoryFn } from "@storybook/react";
import HuggingFaceIcon from "./HuggingFaceIcon";

const meta: Meta<typeof HuggingFaceIcon> = {
  title: "Components/Ui/Icon/HuggingFaceIcon",
  component: HuggingFaceIcon,
};

export default meta;

const Template: StoryFn<typeof HuggingFaceIcon> = (args) => (
  <HuggingFaceIcon {...args} />
);

export const Playground: StoryFn<typeof HuggingFaceIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
