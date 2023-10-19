import { Meta, StoryFn } from "@storybook/react";
import BigQueryIcon from "./BigQueryIcon";

const meta: Meta<typeof BigQueryIcon> = {
  title: "Components/Ui/Icon/BigQueryIcon",
  component: BigQueryIcon,
};

export default meta;

const Template: StoryFn<typeof BigQueryIcon> = (args) => (
  <BigQueryIcon {...args} />
);

export const Playground: StoryFn<typeof BigQueryIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
