import { Meta, StoryFn } from "@storybook/react";
import GitCommitIcon from "./GitCommitIcon";

const meta: Meta<typeof GitCommitIcon> = {
  title: "Components/Ui/Icon/GitCommitIcon",
  component: GitCommitIcon,
};

export default meta;

const Template: StoryFn<typeof GitCommitIcon> = (args) => (
  <GitCommitIcon {...args} />
);

export const Playground: StoryFn<typeof GitCommitIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
