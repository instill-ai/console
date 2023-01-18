import { Meta, StoryFn } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Ui/Common/Sidebar",
  component: Sidebar,
};

export default meta;

const Template: StoryFn<typeof Sidebar> = (args) => <Sidebar {...args} />;

export const Playground: StoryFn<typeof Sidebar> = Template.bind({});

Playground.args = {};
