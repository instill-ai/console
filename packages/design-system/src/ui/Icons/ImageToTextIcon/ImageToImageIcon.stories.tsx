import { Meta, StoryFn } from "@storybook/react";
import ImageToTextIcon from "./ImageToTextIcon";

const meta: Meta<typeof ImageToTextIcon> = {
  title: "Components/Ui/Icon/ImageToTextIcon",
  component: ImageToTextIcon,
};

export default meta;

const Template: StoryFn<typeof ImageToTextIcon> = (args) => (
  <ImageToTextIcon {...args} />
);

export const Playground: StoryFn<typeof ImageToTextIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
