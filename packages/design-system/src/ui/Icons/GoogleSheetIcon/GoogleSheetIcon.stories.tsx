import { Meta, StoryFn } from "@storybook/react";
import GoogleSheetIcon from "./GoogleSheetIcon";

const meta: Meta<typeof GoogleSheetIcon> = {
  title: "Components/Ui/Icon/GoogleSheetIcon",
  component: GoogleSheetIcon,
};

export default meta;

const Template: StoryFn<typeof GoogleSheetIcon> = (args) => (
  <GoogleSheetIcon {...args} />
);

export const Playground: StoryFn<typeof GoogleSheetIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
