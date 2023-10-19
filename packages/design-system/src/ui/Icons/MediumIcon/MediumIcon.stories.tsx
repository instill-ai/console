import { Meta, StoryFn } from "@storybook/react";
import MediumIcon from "./MediumIcon";

const meta: Meta<typeof MediumIcon> = {
  title: "Components/Ui/Icon/MediumIcon",
  component: MediumIcon,
};

export default meta;

const Template: StoryFn<typeof MediumIcon> = (args) => <MediumIcon {...args} />;

export const Playground: StoryFn<typeof MediumIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
