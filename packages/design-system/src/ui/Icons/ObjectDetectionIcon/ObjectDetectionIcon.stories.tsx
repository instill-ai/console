import { Meta, StoryFn } from "@storybook/react";
import ObjectDetectionIcon from "./ObjectDetectionIcon";

const meta: Meta<typeof ObjectDetectionIcon> = {
  title: "Components/Ui/Icon/ObjectDetectionIcon",
  component: ObjectDetectionIcon,
};

export default meta;

const Template: StoryFn<typeof ObjectDetectionIcon> = (args) => (
  <ObjectDetectionIcon {...args} />
);

export const Playground: StoryFn<typeof ObjectDetectionIcon> = Template.bind(
  {}
);

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
