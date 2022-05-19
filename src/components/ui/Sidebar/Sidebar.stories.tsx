import { ComponentStory, ComponentMeta } from "@storybook/react";
import Sidebar from "./Sidebar";

export default {
  title: "Components/Ui/Common/Sidebar",
  component: Sidebar,
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => (
  <Sidebar {...args} />
);

export const Playground: ComponentStory<typeof Sidebar> = Template.bind({});

Playground.args = {};
