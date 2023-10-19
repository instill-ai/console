import { Meta, StoryFn } from "@storybook/react";
import CopyIcon from "./CopyIcon";

const meta: Meta<typeof CopyIcon> = {
  title: "Components/Ui/Icon/CopyIcon",
  component: CopyIcon,
};

export default meta;

const Template: StoryFn<typeof CopyIcon> = (args) => <CopyIcon {...args} />;

export const Playground: StoryFn<typeof CopyIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
