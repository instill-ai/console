import { Meta, StoryFn } from "@storybook/react";
import SemanticSegmentationIcon from "./SemanticSegmentationIcon";

const meta: Meta<typeof SemanticSegmentationIcon> = {
  title: "Components/Ui/Icon/SemanticSegmentationIcon",
  component: SemanticSegmentationIcon,
};

export default meta;

const Template: StoryFn<typeof SemanticSegmentationIcon> = (args) => (
  <SemanticSegmentationIcon {...args} />
);

export const Playground: StoryFn<typeof SemanticSegmentationIcon> =
  Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
