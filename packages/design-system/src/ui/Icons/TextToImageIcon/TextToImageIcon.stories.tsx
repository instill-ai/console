import { Meta, StoryFn } from "@storybook/react";
import TextToImageIcon from "./TextToImageIcon";

const meta: Meta<typeof TextToImageIcon> = {
  title: "Components/Ui/Icon/TextToImageIcon",
  component: TextToImageIcon,
};

export default meta;

const Template: StoryFn<typeof TextToImageIcon> = (args) => (
  <TextToImageIcon {...args} />
);

export const Playground: StoryFn<typeof TextToImageIcon> = Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-semantic-node-disconnected-default-stroke",
  position: "my-auto",
};
