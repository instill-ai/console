import { Meta, StoryFn } from "@storybook/react";
import GoogleDriveIcon from "./GoogleDriveIcon";

const meta: Meta<typeof GoogleDriveIcon> = {
  title: "Components/Ui/Icon/GoogleDriveIcon",
  component: GoogleDriveIcon,
};

export default meta;

const Template: StoryFn<typeof GoogleDriveIcon> = (args) => (
  <GoogleDriveIcon {...args} />
);

export const Playground: StoryFn<typeof GoogleDriveIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
