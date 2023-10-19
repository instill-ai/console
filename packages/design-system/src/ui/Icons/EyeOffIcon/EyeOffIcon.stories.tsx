import { Meta, StoryFn } from "@storybook/react";
import EyeOffIcon from "./EyeOffIcon";

const meta: Meta<typeof EyeOffIcon> = {
  title: "Components/Ui/Icon/EyeOffIcon",
  component: EyeOffIcon,
};

export default meta;

const Template: StoryFn<typeof EyeOffIcon> = (args) => <EyeOffIcon {...args} />;

export const Playground: StoryFn<typeof EyeOffIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
