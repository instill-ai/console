import { Meta, StoryFn } from "@storybook/react";
import MySqlIcon from "./MySqlIcon";

const meta: Meta<typeof MySqlIcon> = {
  title: "Components/Ui/Icon/MySqlIcon",
  component: MySqlIcon,
};

export default meta;

const Template: StoryFn<typeof MySqlIcon> = (args) => <MySqlIcon {...args} />;

export const Playground: StoryFn<typeof MySqlIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
