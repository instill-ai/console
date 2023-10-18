import { Meta, StoryFn } from "@storybook/react";
import GitHubIcon from "./GitHubIcon";

const meta: Meta<typeof GitHubIcon> = {
  title: "Components/Ui/Icon/GitHubIcon",
  component: GitHubIcon,
};

export default meta;

const Template: StoryFn<typeof GitHubIcon> = (args) => <GitHubIcon {...args} />;

export const Playground: StoryFn<typeof GitHubIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};

export const WithStyle: StoryFn<typeof GitHubIcon> = Template.bind({});

WithStyle.args = {
  color: "fill-instillGrey50",
  position: "my-auto",
  style: {
    width: "30px",
    height: "30px",
  },
};
