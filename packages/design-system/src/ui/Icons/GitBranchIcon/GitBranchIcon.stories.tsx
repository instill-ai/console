import { Meta, StoryFn } from "@storybook/react";
import GitBranchIcon from "./GitBranchIcon";

const meta: Meta<typeof GitBranchIcon> = {
  title: "Components/Ui/Icon/GitBranchIcon",
  component: GitBranchIcon,
};

export default meta;

const Template: StoryFn<typeof GitBranchIcon> = (args) => (
  <GitBranchIcon {...args} />
);

export const Playground: StoryFn<typeof GitBranchIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
