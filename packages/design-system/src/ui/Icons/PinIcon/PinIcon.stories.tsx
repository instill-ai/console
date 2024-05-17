import { Meta, StoryFn } from "@storybook/react";
import PinIcon from "./PinIcon";

const meta: Meta<typeof PinIcon> = {
  title: "Components/Ui/Icon/PinIcon",
  component: PinIcon,
};

export default meta;

const Template: StoryFn<typeof PinIcon> = (args) => <PinIcon {...args} />;

export const Playground: StoryFn<typeof PinIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
