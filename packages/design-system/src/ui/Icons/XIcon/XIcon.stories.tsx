import { Meta, StoryFn } from "@storybook/react";
import XIcon from "./XIcon";

const meta: Meta<typeof XIcon> = {
  title: "Components/Ui/Icon/XIcon",
  component: XIcon,
};

export default meta;

const Template: StoryFn<typeof XIcon> = (args) => <XIcon {...args} />;

export const Playground: StoryFn<typeof XIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
