import { Meta, StoryFn } from "@storybook/react";
import CheckIcon from "./CheckIcon";

const meta: Meta<typeof CheckIcon> = {
  title: "Components/Ui/Icon/CheckIcon",
  component: CheckIcon,
};

export default meta;

const Template: StoryFn<typeof CheckIcon> = (args) => <CheckIcon {...args} />;

export const Playground: StoryFn<typeof CheckIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
