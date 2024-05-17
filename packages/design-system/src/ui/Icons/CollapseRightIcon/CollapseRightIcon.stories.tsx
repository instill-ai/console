import { Meta, StoryFn } from "@storybook/react";
import CollapseRightIcon from "./CollapseRightIcon";

const meta: Meta<typeof CollapseRightIcon> = {
  title: "Components/Ui/Icon/CollapseRightIcon",
  component: CollapseRightIcon,
};

export default meta;

const Template: StoryFn<typeof CollapseRightIcon> = (args) => (
  <CollapseRightIcon {...args} />
);

export const Playground: StoryFn<typeof CollapseRightIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
