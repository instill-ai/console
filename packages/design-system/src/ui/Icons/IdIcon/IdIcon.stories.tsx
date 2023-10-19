import { Meta, StoryFn } from "@storybook/react";
import IdIcon from "./IdIcon";

const meta: Meta<typeof IdIcon> = {
  title: "Components/Ui/Icon/IdIcon",
  component: IdIcon,
};

export default meta;

const Template: StoryFn<typeof IdIcon> = (args) => <IdIcon {...args} />;

export const Playground: StoryFn<typeof IdIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
