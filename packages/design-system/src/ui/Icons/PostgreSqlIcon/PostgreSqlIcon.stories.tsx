import { Meta, StoryFn } from "@storybook/react";
import PostgreSqlIcon from "./PostgreSqlIcon";

const meta: Meta<typeof PostgreSqlIcon> = {
  title: "Components/Ui/Icon/PostgreSqlIcon",
  component: PostgreSqlIcon,
};

export default meta;

const Template: StoryFn<typeof PostgreSqlIcon> = (args) => (
  <PostgreSqlIcon {...args} />
);

export const Playground: StoryFn<typeof PostgreSqlIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
