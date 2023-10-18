import { Meta, StoryFn } from "@storybook/react";
import MenuIcon from "./MenuIcon";

const meta: Meta<typeof MenuIcon> = {
  title: "Components/Ui/Icon/MenuIcon",
  component: MenuIcon,
};

export default meta;

const Template: StoryFn<typeof MenuIcon> = (args) => <MenuIcon {...args} />;

export const Playground: StoryFn<typeof MenuIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
