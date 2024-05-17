import { Meta, StoryFn } from "@storybook/react";
import DocIcon from "./DocIcon";

const meta: Meta<typeof DocIcon> = {
  title: "Components/Ui/Icon/DocIcon",
  component: DocIcon,
};

export default meta;

const Template: StoryFn<typeof DocIcon> = (args) => <DocIcon {...args} />;

export const Playground: StoryFn<typeof DocIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
