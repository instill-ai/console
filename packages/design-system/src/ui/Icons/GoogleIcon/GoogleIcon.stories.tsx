import { Meta, StoryFn } from "@storybook/react";
import GoogleIcon from "./GoogleIcon";

const meta: Meta<typeof GoogleIcon> = {
  title: "Components/Ui/Icon/GoogleIcon",
  component: GoogleIcon,
};

export default meta;

const Template: StoryFn<typeof GoogleIcon> = (args) => (
  <GoogleIcon {...args} />
);

export const Playground: StoryFn<typeof GoogleIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
