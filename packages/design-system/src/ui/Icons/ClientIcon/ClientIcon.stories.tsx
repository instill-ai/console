import { Meta, StoryFn } from "@storybook/react";
import ClientIcon from "./ClientIcon";

const meta: Meta<typeof ClientIcon> = {
  title: "Components/Ui/Icon/ClientIcon",
  component: ClientIcon,
};

export default meta;

const Template: StoryFn<typeof ClientIcon> = (args) => <ClientIcon {...args} />;

export const Playground: StoryFn<typeof ClientIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
