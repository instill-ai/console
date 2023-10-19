import { Meta, StoryFn } from "@storybook/react";
import PipelineIcon from "./PipelineIcon";

const meta: Meta<typeof PipelineIcon> = {
  title: "Components/Ui/Icon/PipelineIcon",
  component: PipelineIcon,
};

export default meta;

const Template: StoryFn<typeof PipelineIcon> = (args) => (
  <PipelineIcon {...args} />
);

export const Playground: StoryFn<typeof PipelineIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
