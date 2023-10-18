import { Meta, StoryFn } from "@storybook/react";
import GearIcon from "./GearIcon";

const meta: Meta<typeof GearIcon> = {
  title: "Components/Ui/Icon/GearIcon",
  component: GearIcon,
};

export default meta;

const Template: StoryFn<typeof GearIcon> = (args) => <GearIcon {...args} />;

export const Playground: StoryFn<typeof GearIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
