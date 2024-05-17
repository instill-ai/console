import { Meta, StoryFn } from "@storybook/react";
import ToggleIcon from "./ToggleIcon";

const meta: Meta<typeof ToggleIcon> = {
  title: "Components/Ui/Icon/ToggleIcon",
  component: ToggleIcon,
};

export default meta;

const Template: StoryFn<typeof ToggleIcon> = (args) => <ToggleIcon {...args} />;

export const Playground: StoryFn<typeof ToggleIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
