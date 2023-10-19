import { Meta, StoryFn } from "@storybook/react";
import MetabaseIcon from "./MetabaseIcon";

const meta: Meta<typeof MetabaseIcon> = {
  title: "Components/Ui/Icon/MetabaseIcon",
  component: MetabaseIcon,
};

export default meta;

const Template: StoryFn<typeof MetabaseIcon> = (args) => (
  <MetabaseIcon {...args} />
);

export const Playground: StoryFn<typeof MetabaseIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
