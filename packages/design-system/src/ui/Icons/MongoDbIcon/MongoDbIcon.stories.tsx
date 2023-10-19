import { Meta, StoryFn } from "@storybook/react";
import MongoDbIcon from "./MongoDbIcon";

const meta: Meta<typeof MongoDbIcon> = {
  title: "Components/Ui/Icon/MongoDbIcon",
  component: MongoDbIcon,
};

export default meta;

const Template: StoryFn<typeof MongoDbIcon> = (args) => (
  <MongoDbIcon {...args} />
);

export const Playground: StoryFn<typeof MongoDbIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
