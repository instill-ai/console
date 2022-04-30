import { ComponentStory, ComponentMeta } from "@storybook/react";
import CreatePipelineProgress from "./CreatePipelineProgress";

export default {
  title: "Components/Ui/CreatePipelineProgress",
  component: CreatePipelineProgress,
} as ComponentMeta<typeof CreatePipelineProgress>;

const Template: ComponentStory<typeof CreatePipelineProgress> = (args) => (
  <CreatePipelineProgress {...args} />
);

export const Playground: ComponentStory<typeof CreatePipelineProgress> =
  Template.bind({});

Playground.args = {};
