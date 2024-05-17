import { Meta, StoryFn } from "@storybook/react";
import FolderInUseIcon from "./FolderInUseIcon";

const meta: Meta<typeof FolderInUseIcon> = {
  title: "Components/Ui/Icon/FolderInUseIcon",
  component: FolderInUseIcon,
};

export default meta;

const Template: StoryFn<typeof FolderInUseIcon> = (args) => (
  <FolderInUseIcon {...args} />
);

export const Playground: StoryFn<typeof FolderInUseIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
