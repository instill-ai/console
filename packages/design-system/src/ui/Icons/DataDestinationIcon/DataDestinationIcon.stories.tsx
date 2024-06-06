import { Meta, StoryFn } from "@storybook/react";
import DataDestinationIcon from "./DataDestinationIcon";

const meta: Meta<typeof DataDestinationIcon> = {
  title: "Components/Ui/Icon/DataDestinationIcon",
  component: DataDestinationIcon,
};

export default meta;

const Template: StoryFn<typeof DataDestinationIcon> = (args) => (
  <DataDestinationIcon {...args} />
);

export const Playground: StoryFn<typeof DataDestinationIcon> = Template.bind(
  {}
);

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
