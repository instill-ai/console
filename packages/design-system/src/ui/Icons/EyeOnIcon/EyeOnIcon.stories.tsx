import { Meta, StoryFn } from "@storybook/react";
import EyeOnIcon from "./EyeOnIcon";

const meta: Meta<typeof EyeOnIcon> = {
  title: "Components/Ui/Icon/EyeOnIcon",
  component: EyeOnIcon,
};

export default meta;

const Template: StoryFn<typeof EyeOnIcon> = (args) => <EyeOnIcon {...args} />;

export const Playground: StoryFn<typeof EyeOnIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
