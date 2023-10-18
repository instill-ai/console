import { Meta, StoryFn } from "@storybook/react";
import SquareProgressBase from "./SquareProgressBase";

const meta: Meta<typeof SquareProgressBase> = {
  title: "Components/Base/Common/SquareProgressBase",
  component: SquareProgressBase,
};

export default meta;

const Template: StoryFn<typeof SquareProgressBase> = (args) => (
  <SquareProgressBase
    {...args}
    bgColor="bg-white"
    cubeColor="bg-instillBlue50"
    blockSize={36}
  />
);
export const Playground: StoryFn<typeof SquareProgressBase> = Template.bind({});

Playground.args = {
  isLoading: true,
  animationDuration: 3,
};
