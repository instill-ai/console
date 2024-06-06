import { Meta, StoryFn } from "@storybook/react";
import SyncArrowsIcon from "./SyncArrowsIcon";

const meta: Meta<typeof SyncArrowsIcon> = {
  title: "Components/Ui/Icon/SyncArrowsIcon",
  component: SyncArrowsIcon,
};

export default meta;

const Template: StoryFn<typeof SyncArrowsIcon> = (args) => (
  <SyncArrowsIcon {...args} />
);

export const Playground: StoryFn<typeof SyncArrowsIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
