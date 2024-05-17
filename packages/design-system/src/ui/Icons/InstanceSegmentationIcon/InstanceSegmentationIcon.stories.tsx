import { Meta, StoryFn } from "@storybook/react";
import InstanceSegmentationIcon from "./InstanceSegmentationIcon";

const meta: Meta<typeof InstanceSegmentationIcon> = {
  title: "Components/Ui/Icon/InstanceSegmentationIcon",
  component: InstanceSegmentationIcon,
};

export default meta;

const Template: StoryFn<typeof InstanceSegmentationIcon> = (args) => (
  <InstanceSegmentationIcon {...args} />
);

export const Playground: StoryFn<typeof InstanceSegmentationIcon> =
  Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
