import { Meta, StoryFn } from "@storybook/react";
import GcsIcon from "./GcsIcon";

const meta: Meta<typeof GcsIcon> = {
  title: "Components/Ui/Icon/GcsIcon",
  component: GcsIcon,
};

export default meta;

const Template: StoryFn<typeof GcsIcon> = (args) => <GcsIcon {...args} />;

export const Playground: StoryFn<typeof GcsIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
