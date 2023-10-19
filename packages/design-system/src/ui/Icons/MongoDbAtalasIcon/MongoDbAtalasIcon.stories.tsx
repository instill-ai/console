import { Meta, StoryFn } from "@storybook/react";
import MongoDbAtalasIcon from "./MongoDbAtalasIcon";

const meta: Meta<typeof MongoDbAtalasIcon> = {
  title: "Components/Ui/Icon/MongoDbAtalasIcon",
  component: MongoDbAtalasIcon,
};

export default meta;

const Template: StoryFn<typeof MongoDbAtalasIcon> = (args) => (
  <MongoDbAtalasIcon {...args} />
);

export const Playground: StoryFn<typeof MongoDbAtalasIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
