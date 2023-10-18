import { Meta, StoryFn } from "@storybook/react";
import OnnxIcon from "./OnnxIcon";

const meta: Meta<typeof OnnxIcon> = {
  title: "Components/Ui/Icon/OnnxIcon",
  component: OnnxIcon,
};

export default meta;

const Template: StoryFn<typeof OnnxIcon> = (args) => <OnnxIcon {...args} />;

export const Playground: StoryFn<typeof OnnxIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
