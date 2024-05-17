import { Meta, StoryFn } from "@storybook/react";
import RefreshIcon from "./RefreshIcon";

const meta: Meta<typeof RefreshIcon> = {
  title: "Components/Ui/Icon/RefreshIcon",
  component: RefreshIcon,
};

export default meta;

const Template: StoryFn<typeof RefreshIcon> = (args) => (
  <RefreshIcon {...args} />
);

export const Playground: StoryFn<typeof RefreshIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
