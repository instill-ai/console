import { Meta, StoryFn } from "@storybook/react";
import LocalUploadIcon from "./LocalUploadIcon";

const meta: Meta<typeof LocalUploadIcon> = {
  title: "Components/Ui/Icon/LocalUploadIcon",
  component: LocalUploadIcon,
};

export default meta;

const Template: StoryFn<typeof LocalUploadIcon> = (args) => (
  <LocalUploadIcon {...args} />
);

export const Playground: StoryFn<typeof LocalUploadIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
