import { Meta, StoryFn } from "@storybook/react";
import OpticalCharacterRecognitionIcon from "./OpticalCharacterRecognitionIcon";

const meta: Meta<typeof OpticalCharacterRecognitionIcon> = {
  title: "Components/Ui/Icon/OpticalCharacterRecognitionIcon",
  component: OpticalCharacterRecognitionIcon,
};

export default meta;

const Template: StoryFn<typeof OpticalCharacterRecognitionIcon> = (args) => (
  <OpticalCharacterRecognitionIcon {...args} />
);

export const Playground: StoryFn<typeof OpticalCharacterRecognitionIcon> =
  Template.bind({});

Playground.args = {
  width: "w-[30px]",
  height: "h-[30px]",
  color: "fill-instillGrey50",
  position: "my-auto",
};
