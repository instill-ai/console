import { Meta, StoryFn } from "@storybook/react";
import LinkedInIcon from "./LinkedInIcon";

const meta: Meta<typeof LinkedInIcon> = {
  title: "Components/Ui/Icon/LinkedInIcon",
  component: LinkedInIcon,
};

export default meta;

const Template: StoryFn<typeof LinkedInIcon> = (args) => (
  <LinkedInIcon {...args} />
);

export const Playground: StoryFn<typeof LinkedInIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
