import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Components/NewUi/Progress",
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const Regular: Story = {
  render: () => <Progress className="w-full" value={33} />,
};
