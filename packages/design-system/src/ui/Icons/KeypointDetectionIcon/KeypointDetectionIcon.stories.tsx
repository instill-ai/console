import { Meta, StoryFn } from "@storybook/react";
import KeypointDetectionIcon from "./KeypointDetectionIcon";

const meta: Meta<typeof KeypointDetectionIcon> = {
  title: "Components/Ui/Icon/KeypointDetectionIcon",
  component: KeypointDetectionIcon,
};

export default meta;

const Template: StoryFn<typeof KeypointDetectionIcon> = (args) => (
  <KeypointDetectionIcon {...args} />
);

export const Playground: StoryFn<typeof KeypointDetectionIcon> = Template.bind(
  {}
);

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
