import { Meta, StoryFn } from "@storybook/react";
import StatusOnIcon from "./StatusOnIcon";

const meta: Meta<typeof StatusOnIcon> = {
  title: "Components/Ui/Icon/StatusOnIcon",
  component: StatusOnIcon,
};

export default meta;

const Template: StoryFn<typeof StatusOnIcon> = (args) => (
  <StatusOnIcon {...args} />
);

export const Playground: StoryFn<typeof StatusOnIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
