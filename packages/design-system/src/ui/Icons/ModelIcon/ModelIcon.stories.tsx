import { Meta, StoryFn } from "@storybook/react";
import ModelIcon from "./ModelIcon";

const meta: Meta<typeof ModelIcon> = {
  title: "Components/Ui/Icon/ModelIcon",
  component: ModelIcon,
};

export default meta;

const Template: StoryFn<typeof ModelIcon> = (args) => <ModelIcon {...args} />;

export const Playground: StoryFn<typeof ModelIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
