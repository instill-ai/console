import { Meta, StoryFn } from "@storybook/react";
import SyncIcon from "./SyncIcon";

const meta: Meta<typeof SyncIcon> = {
  title: "Components/Ui/Icon/SyncIcon",
  component: SyncIcon,
};

export default meta;

const Template: StoryFn<typeof SyncIcon> = (args) => <SyncIcon {...args} />;

export const Playground: StoryFn<typeof SyncIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
