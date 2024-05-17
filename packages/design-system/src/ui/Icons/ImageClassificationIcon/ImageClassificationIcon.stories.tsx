import { Meta, StoryFn } from "@storybook/react";
import ImageClassificationIcon from "./ImageClassificationIcon";

const meta: Meta<typeof ImageClassificationIcon> = {
  title: "Components/Ui/Icon/ImageClassificationIcon",
  component: ImageClassificationIcon,
};

export default meta;

const Template: StoryFn<typeof ImageClassificationIcon> = (args) => (
  <ImageClassificationIcon {...args} />
);

export const Playground: StoryFn<typeof ImageClassificationIcon> =
  Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
