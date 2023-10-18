import { Meta, StoryFn } from "@storybook/react";
import ImageToImageIcon from "./ImageToImageIcon";

const meta: Meta<typeof ImageToImageIcon> = {
  title: "Components/Ui/Icon/ImageToImageIcon",
  component: ImageToImageIcon,
};

export default meta;

const Template: StoryFn<typeof ImageToImageIcon> = (args) => (
  <ImageToImageIcon {...args} />
);

export const Playground: StoryFn<typeof ImageToImageIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
