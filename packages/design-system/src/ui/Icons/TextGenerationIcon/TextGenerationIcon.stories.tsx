import { Meta, StoryFn } from "@storybook/react";
import TextGenerationIcon from "./TextGenerationIcon";

const meta: Meta<typeof TextGenerationIcon> = {
  title: "Components/Ui/Icon/TextGenerationIcon",
  component: TextGenerationIcon,
};

export default meta;

const Template: StoryFn<typeof TextGenerationIcon> = (args) => (
  <TextGenerationIcon {...args} />
);

export const Playground: StoryFn<typeof TextGenerationIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
