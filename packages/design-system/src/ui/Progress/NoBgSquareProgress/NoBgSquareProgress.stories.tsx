import { Meta, StoryFn } from "@storybook/react";
import NoBgSquareProgress from "./NoBgSquareProgress";

const meta: Meta<typeof NoBgSquareProgress> = {
  title: "Components/Ui/Common/NoBgSquareProgress",
  component: NoBgSquareProgress,
};

export default meta;

const Template: StoryFn<typeof NoBgSquareProgress> = (args) => (
  <NoBgSquareProgress {...args} blockSize={48} />
);
export const Playground: StoryFn<typeof NoBgSquareProgress> = Template.bind({});

Playground.args = {
  isLoading: true,
};
