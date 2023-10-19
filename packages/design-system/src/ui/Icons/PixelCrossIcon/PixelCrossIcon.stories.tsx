import { Meta, StoryFn } from "@storybook/react";
import PixelCrossIcon from "./PixelCrossIcon";

const meta: Meta<typeof PixelCrossIcon> = {
  title: "Components/Ui/Icon/PixelCrossIcon",
  component: PixelCrossIcon,
};

export default meta;

const Template: StoryFn<typeof PixelCrossIcon> = (args) => (
  <PixelCrossIcon {...args} />
);

export const Playground: StoryFn<typeof PixelCrossIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
