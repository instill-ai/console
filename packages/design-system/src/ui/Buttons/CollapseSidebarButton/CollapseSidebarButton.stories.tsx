import { Meta, StoryFn } from "@storybook/react";
import CollapseSidebarButton from "./CollapseSidebarButton";

const meta: Meta<typeof CollapseSidebarButton> = {
  title: "Components/Ui/Button/CollapseSidebarButton",
  component: CollapseSidebarButton,
};

export default meta;

const Template: StoryFn<typeof CollapseSidebarButton> = (args) => (
  <CollapseSidebarButton {...args} />
);
export const Playground: StoryFn<typeof CollapseSidebarButton> = Template.bind(
  {}
);

Playground.args = {
  isCollapse: false,
};
