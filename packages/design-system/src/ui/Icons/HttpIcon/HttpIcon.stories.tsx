import { Meta, StoryFn } from "@storybook/react";
import HttpIcon from "./HttpIcon";

const meta: Meta<typeof HttpIcon> = {
  title: "Components/Ui/Icon/HttpIcon",
  component: HttpIcon,
};

export default meta;

const Template: StoryFn<typeof HttpIcon> = (args) => <HttpIcon {...args} />;

export const Playground: StoryFn<typeof HttpIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
