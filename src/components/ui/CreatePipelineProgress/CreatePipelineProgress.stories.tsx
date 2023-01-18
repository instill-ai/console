import { Meta, StoryFn } from "@storybook/react";
import { CreatePipelineProgress } from "./CreatePipelineProgress";

const meta: Meta<typeof CreatePipelineProgress> = {
  title: "Components/Ui/CreatePipelineProgress",
  component: CreatePipelineProgress,
};

export default meta;

const Template: StoryFn<typeof CreatePipelineProgress> = (args) => (
  <CreatePipelineProgress {...args} />
);

export const Playground: StoryFn<typeof CreatePipelineProgress> = Template.bind(
  {}
);

Playground.args = {};
