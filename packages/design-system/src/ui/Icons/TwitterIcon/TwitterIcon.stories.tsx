import { Meta, StoryFn } from "@storybook/react";
import TwitterIcon from "./TwitterIcon";

const meta: Meta<typeof TwitterIcon> = {
  title: "Components/Ui/Icon/TwitterIcon",
  component: TwitterIcon,
};

export default meta;

const Template: StoryFn<typeof TwitterIcon> = (args) => (
  <TwitterIcon {...args} />
);

export const Playground: StoryFn<typeof TwitterIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
