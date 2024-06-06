import { Meta, StoryFn } from "@storybook/react";
import DiscordIcon from "./DiscordIcon";

const meta: Meta<typeof DiscordIcon> = {
  title: "Components/Ui/Icon/DiscordIcon",
  component: DiscordIcon,
};

export default meta;

const Template: StoryFn<typeof DiscordIcon> = (args) => (
  <DiscordIcon {...args} />
);

export const Playground: StoryFn<typeof DiscordIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
