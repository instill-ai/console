import { Meta, StoryFn } from "@storybook/react";
import DarkBgSquareProgress from "./DarkBgSquareProgress";

const meta: Meta<typeof DarkBgSquareProgress> = {
  title: "Components/Ui/Common/DarkBgSquareProgress",
  component: DarkBgSquareProgress,
};

export default meta;

const Template: StoryFn<typeof DarkBgSquareProgress> = (args) => (
  <DarkBgSquareProgress {...args} blockSize={48} />
);
export const Playground: StoryFn<typeof DarkBgSquareProgress> = Template.bind(
  {}
);

Playground.args = {
  isLoading: true,
};
