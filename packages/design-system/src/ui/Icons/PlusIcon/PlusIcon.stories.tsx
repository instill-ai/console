import { Meta, StoryFn } from "@storybook/react";
import PlusIcon from "./PlusIcon";

const meta: Meta<typeof PlusIcon> = {
  title: "Components/Ui/Icon/PlusIcon",
  component: PlusIcon,
};

export default meta;

const Template: StoryFn<typeof PlusIcon> = (args) => <PlusIcon {...args} />;

export const Playground: StoryFn<typeof PlusIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
