import { Meta, StoryFn } from "@storybook/react";
import GitTagIcon from "./GitTagIcon";

const meta: Meta<typeof GitTagIcon> = {
  title: "Components/Ui/Icon/GitTagIcon",
  component: GitTagIcon,
};

export default meta;

const Template: StoryFn<typeof GitTagIcon> = (args) => <GitTagIcon {...args} />;

export const Playground: StoryFn<typeof GitTagIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
