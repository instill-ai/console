import { Meta, StoryFn } from "@storybook/react";
import CrossIcon from "./CrossIcon";

const meta: Meta<typeof CrossIcon> = {
  title: "Components/Ui/Icon/CrossIcon",
  component: CrossIcon,
};

export default meta;

const Template: StoryFn<typeof CrossIcon> = (args) => <CrossIcon {...args} />;

export const Playground: StoryFn<typeof CrossIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
