import { Meta, StoryFn } from "@storybook/react";
import { ArrowRightIcon } from "../../Icons";
import TextButton from "./TextButton";

const meta: Meta<typeof TextButton> = {
  title: "Components/Ui/Button/TextButton",
  component: TextButton,
};

export default meta;

const Template: StoryFn<typeof TextButton> = (args) => (
  <TextButton {...args}>Button</TextButton>
);
export const Playground: StoryFn<typeof TextButton> = Template.bind({});

Playground.args = {
  color: "primary",
};

export const WithIcon: StoryFn<typeof TextButton> = Template.bind({});

WithIcon.args = {
  color: "primary",
  itemGapX: "gap-x-5",
  textSize: "text-2xl",
  endIcon: (
    <ArrowRightIcon
      width="w-4"
      height="h-4"
      color="fill-instillBlue50 group-hover:fill-instillBlue80"
      position="my-auto"
    />
  ),
};
