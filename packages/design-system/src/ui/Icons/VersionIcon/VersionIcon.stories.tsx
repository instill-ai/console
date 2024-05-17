import { Meta, StoryFn } from "@storybook/react";
import VersionIcon from "./VersionIcon";

const meta: Meta<typeof VersionIcon> = {
  title: "Components/Ui/Icon/VersionIcon",
  component: VersionIcon,
};

export default meta;

const Template: StoryFn<typeof VersionIcon> = (args) => (
  <VersionIcon {...args} />
);

export const Playground: StoryFn<typeof VersionIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
