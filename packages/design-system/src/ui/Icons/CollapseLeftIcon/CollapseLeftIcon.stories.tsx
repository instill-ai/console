import { Meta, StoryFn } from "@storybook/react";
import CollapseLeftIcon from "./CollapseLeftIcon";

const meta: Meta<typeof CollapseLeftIcon> = {
  title: "Components/Ui/Icon/CollapseLeftIcon",
  component: CollapseLeftIcon,
};

export default meta;

const Template: StoryFn<typeof CollapseLeftIcon> = (args) => (
  <CollapseLeftIcon {...args} />
);

export const Playground: StoryFn<typeof CollapseLeftIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
