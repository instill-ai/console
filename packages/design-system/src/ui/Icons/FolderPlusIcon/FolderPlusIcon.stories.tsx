import { Meta, StoryFn } from "@storybook/react";
import FolderPlusIcon from "./FolderPlusIcon";

const meta: Meta<typeof FolderPlusIcon> = {
  title: "Components/Ui/Icon/FolderPlusIcon",
  component: FolderPlusIcon,
};

export default meta;

const Template: StoryFn<typeof FolderPlusIcon> = (args) => (
  <FolderPlusIcon {...args} />
);

export const Playground: StoryFn<typeof FolderPlusIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
