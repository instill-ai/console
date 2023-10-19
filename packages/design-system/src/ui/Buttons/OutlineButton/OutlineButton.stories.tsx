import { Meta, StoryFn } from "@storybook/react";
import { DiscordIcon, MediumIcon } from "../../Icons";
import OutlineButton from "./OutlineButton";

const meta: Meta<typeof OutlineButton> = {
  title: "Components/Ui/Button/OutlineButton",
  component: OutlineButton,
};

export default meta;

const Template: StoryFn<typeof OutlineButton> = (args) => (
  <OutlineButton {...args}>Button</OutlineButton>
);

export const Playground: StoryFn<typeof OutlineButton> = Template.bind({});

Playground.args = {
  color: "primary",
};

export const DiscordButton: StoryFn<typeof OutlineButton> = Template.bind({});

DiscordButton.args = {
  color: "primary",
  itemGapX: "gap-x-3",
  startIcon: (
    <DiscordIcon
      width="w-5"
      height="h-5"
      color="fill-instillBlue50 group-hover:fill-instillBlue10"
      position="my-auto"
    />
  ),
};

export const MediumButton: StoryFn<typeof OutlineButton> = Template.bind({});

MediumButton.args = {
  color: "primary",
  itemGapX: "gap-x-3",
  endIcon: (
    <MediumIcon
      width="w-5"
      height="h-5"
      color="fill-instillBlue50 group-hover:fill-instillBlue10"
      position="my-auto"
    />
  ),
};
