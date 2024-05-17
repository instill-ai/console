import { Meta, StoryFn } from "@storybook/react";
import StatusErrorIcon from "./StatusErrorIcon";

const meta: Meta<typeof StatusErrorIcon> = {
  title: "Components/Ui/Icon/StatusErrorIcon",
  component: StatusErrorIcon,
};

export default meta;

const Template: StoryFn<typeof StatusErrorIcon> = (args) => (
  <StatusErrorIcon {...args} />
);

export const Playground: StoryFn<typeof StatusErrorIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
