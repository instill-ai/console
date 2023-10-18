import { Meta, StoryFn } from "@storybook/react";
import DataSourceIcon from "./DataSourceIcon";

const meta: Meta<typeof DataSourceIcon> = {
  title: "Components/Ui/Icon/DataSourceIcon",
  component: DataSourceIcon,
};

export default meta;

const Template: StoryFn<typeof DataSourceIcon> = (args) => (
  <DataSourceIcon {...args} />
);

export const Playground: StoryFn<typeof DataSourceIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
