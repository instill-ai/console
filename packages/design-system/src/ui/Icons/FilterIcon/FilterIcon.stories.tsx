import { Meta, StoryFn } from "@storybook/react";
import FilterIcon from "./FilterIcon";

const meta: Meta<typeof FilterIcon> = {
  title: "Components/Ui/Icon/FilterIcon",
  component: FilterIcon,
};

export default meta;

const Template: StoryFn<typeof FilterIcon> = (args) => <FilterIcon {...args} />;

export const Playground: StoryFn<typeof FilterIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
