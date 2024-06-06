import { Meta, StoryFn } from "@storybook/react";
import PixelCheckIcon from "./PixelCheckIcon";

const meta: Meta<typeof PixelCheckIcon> = {
  title: "Components/Ui/Icon/PixelCheckIcon",
  component: PixelCheckIcon,
};

export default meta;

const Template: StoryFn<typeof PixelCheckIcon> = (args) => (
  <PixelCheckIcon {...args} />
);

export const Playground: StoryFn<typeof PixelCheckIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
