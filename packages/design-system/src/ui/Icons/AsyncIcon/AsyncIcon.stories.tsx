import { Meta, StoryFn } from "@storybook/react";
import AsyncIcon from "./AsyncIcon";

const meta: Meta<typeof AsyncIcon> = {
  title: "Components/Ui/Icon/AsyncIcon",
  component: AsyncIcon,
};

export default meta;

const Template: StoryFn<typeof AsyncIcon> = (args) => <AsyncIcon {...args} />;

export const Playground: StoryFn<typeof AsyncIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
