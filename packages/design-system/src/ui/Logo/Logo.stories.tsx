import { Meta, StoryFn } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Components/Ui/Logo",
  component: Logo,
};

export default meta;

const Template: StoryFn<typeof Logo> = (args) => <Logo {...args} />;

export const Default: StoryFn<typeof Logo> = Template.bind({});
