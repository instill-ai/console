import { Meta, StoryFn } from "@storybook/react";
import FacebookIcon from "./FacebookIcon";

const meta: Meta<typeof FacebookIcon> = {
  title: "Components/Ui/Icon/FacebookIcon",
  component: FacebookIcon,
};

export default meta;

const Template: StoryFn<typeof FacebookIcon> = (args) => (
  <FacebookIcon {...args} />
);

export const Playground: StoryFn<typeof FacebookIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
