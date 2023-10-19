import { Meta, StoryFn } from "@storybook/react";
import WhiteBgSquareProgress from "./WhiteBgSquareProgress";

const meta: Meta<typeof WhiteBgSquareProgress> = {
  title: "Components/Ui/Common/WhiteBgSquareProgress",
  component: WhiteBgSquareProgress,
};

export default meta;

const Template: StoryFn<typeof WhiteBgSquareProgress> = (args) => (
  <WhiteBgSquareProgress {...args} blockSize={48} />
);
export const Playground: StoryFn<typeof WhiteBgSquareProgress> = Template.bind(
  {}
);

Playground.args = {
  isLoading: true,
};
