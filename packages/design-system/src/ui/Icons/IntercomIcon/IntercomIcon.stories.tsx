import { Meta, StoryFn } from "@storybook/react";

import IntercomIcon from "./IntercomIcon";

const meta: Meta<typeof IntercomIcon> = {
  title: "Components/Ui/Icon/IntercomIcon",
  component: IntercomIcon,
};

export default meta;

const Template: StoryFn<typeof IntercomIcon> = (args) => (
  <IntercomIcon {...args} />
);

export const Playground: StoryFn<typeof IntercomIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
