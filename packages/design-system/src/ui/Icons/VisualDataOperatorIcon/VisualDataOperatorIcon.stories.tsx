import { Meta, StoryFn } from "@storybook/react";
import VisualDataOperatorIcon from "./VisualDataOperatorIcon";

const meta: Meta<typeof VisualDataOperatorIcon> = {
  title: "Components/Ui/Icon/VisualDataOperatorIcon",
  component: VisualDataOperatorIcon,
};

export default meta;

const Template: StoryFn<typeof VisualDataOperatorIcon> = (args) => (
  <VisualDataOperatorIcon {...args} />
);

export const Playground: StoryFn<typeof VisualDataOperatorIcon> = Template.bind(
  {}
);

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
