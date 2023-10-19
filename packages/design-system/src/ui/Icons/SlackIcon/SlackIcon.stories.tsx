import { Meta, StoryFn } from "@storybook/react";
import SlackIcon from "./SlackIcon";

const meta: Meta<typeof SlackIcon> = {
  title: "Components/Ui/Icon/SlackIcon",
  component: SlackIcon,
};

export default meta;

const Template: StoryFn<typeof SlackIcon> = (args) => <SlackIcon {...args} />;

export const Playground: StoryFn<typeof SlackIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
