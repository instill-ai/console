import { Meta, StoryFn } from "@storybook/react";
import AirbyteIcon from "./AirbyteIcon";

const meta: Meta<typeof AirbyteIcon> = {
  title: "Components/Ui/Icon/AirbyteIcon",
  component: AirbyteIcon,
};

export default meta;

const Template: StoryFn<typeof AirbyteIcon> = (args) => (
  <AirbyteIcon {...args} />
);

export const Playground: StoryFn<typeof AirbyteIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
