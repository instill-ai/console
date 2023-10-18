import { Meta, StoryFn } from "@storybook/react";
import ResourceIcon from "./ResourceIcon";

const meta: Meta<typeof ResourceIcon> = {
  title: "Components/Ui/Icon/ResourceIcon",
  component: ResourceIcon,
};

export default meta;

const Template: StoryFn<typeof ResourceIcon> = (args) => (
  <ResourceIcon {...args} />
);

export const Playground: StoryFn<typeof ResourceIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
