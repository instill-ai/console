import { Meta, StoryFn } from "@storybook/react";
import BarChartIcon from "./BarChartIcon";

const meta: Meta<typeof BarChartIcon> = {
  title: "Components/Ui/Icon/BarChartIcon",
  component: BarChartIcon,
};

export default meta;

const Template: StoryFn<typeof BarChartIcon> = (args) => (
  <BarChartIcon {...args} />
);

export const Playground: StoryFn<typeof BarChartIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
