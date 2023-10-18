import { Meta, StoryFn } from "@storybook/react";
import RedShiftIcon from "./RedShiftIcon";

const meta: Meta<typeof RedShiftIcon> = {
  title: "Components/Ui/Icon/RedShiftIcon",
  component: RedShiftIcon,
};

export default meta;

const Template: StoryFn<typeof RedShiftIcon> = (args) => (
  <RedShiftIcon {...args} />
);

export const Playground: StoryFn<typeof RedShiftIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
