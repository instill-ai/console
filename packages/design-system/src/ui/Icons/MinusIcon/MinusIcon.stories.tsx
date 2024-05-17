import { Meta, StoryFn } from "@storybook/react";
import MinusIcon from "./MinusIcon";

const meta: Meta<typeof MinusIcon> = {
  title: "Components/Ui/Icon/MinusIcon",
  component: MinusIcon,
};

export default meta;

const Template: StoryFn<typeof MinusIcon> = (args) => <MinusIcon {...args} />;

export const Playground: StoryFn<typeof MinusIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
