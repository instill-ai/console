import { Meta, StoryFn } from "@storybook/react";
import GrpcIcon from "./GrpcIcon";

const meta: Meta<typeof GrpcIcon> = {
  title: "Components/Ui/Icon/GrpcIcon",
  component: GrpcIcon,
};

export default meta;

const Template: StoryFn<typeof GrpcIcon> = (args) => <GrpcIcon {...args} />;

export const Playground: StoryFn<typeof GrpcIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
