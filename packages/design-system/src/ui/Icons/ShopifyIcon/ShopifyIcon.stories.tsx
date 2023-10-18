import { Meta, StoryFn } from "@storybook/react";
import ShopifyIcon from "./ShopifyIcon";

const meta: Meta<typeof ShopifyIcon> = {
  title: "Components/Ui/Icon/ShopifyIcon",
  component: ShopifyIcon,
};

export default meta;

const Template: StoryFn<typeof ShopifyIcon> = (args) => (
  <ShopifyIcon {...args} />
);

export const Playground: StoryFn<typeof ShopifyIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  position: "my-auto",
};
