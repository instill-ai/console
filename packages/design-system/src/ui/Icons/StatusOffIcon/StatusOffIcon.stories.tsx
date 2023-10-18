import { Meta, StoryFn } from "@storybook/react";
import StatusOffIcon from "./StatusOffIcon";

const meta: Meta<typeof StatusOffIcon> = {
  title: "Components/Ui/Icon/StatusOffIcon",
  component: StatusOffIcon,
};

export default meta;

const Template: StoryFn<typeof StatusOffIcon> = (args) => (
  <StatusOffIcon {...args} />
);

export const Playground: StoryFn<typeof StatusOffIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
