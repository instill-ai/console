import { Meta, StoryFn } from "@storybook/react";
import SnowflakeIcon from "./SnowflakeIcon";

const meta: Meta<typeof SnowflakeIcon> = {
  title: "Components/Ui/Icon/SnowflakeIcon",
  component: SnowflakeIcon,
};

export default meta;

const Template: StoryFn<typeof SnowflakeIcon> = (args) => (
  <SnowflakeIcon {...args} />
);

export const Playground: StoryFn<typeof SnowflakeIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
