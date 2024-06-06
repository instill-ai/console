import { Meta, StoryFn } from "@storybook/react";
import PenIcon from "./PenIcon";

const meta: Meta<typeof PenIcon> = {
  title: "Components/Ui/Icon/PenIcon",
  component: PenIcon,
};

export default meta;

const Template: StoryFn<typeof PenIcon> = (args) => <PenIcon {...args} />;

export const Playground: StoryFn<typeof PenIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
