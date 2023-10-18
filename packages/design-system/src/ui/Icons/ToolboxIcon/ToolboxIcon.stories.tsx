import { Meta, StoryFn } from "@storybook/react";
import ToolboxIcon from "./ToolboxIcon";

const meta: Meta<typeof ToolboxIcon> = {
  title: "Components/Ui/Icon/ToolboxIcon",
  component: ToolboxIcon,
};

export default meta;

const Template: StoryFn<typeof ToolboxIcon> = (args) => (
  <ToolboxIcon {...args} />
);

export const Playground: StoryFn<typeof ToolboxIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
