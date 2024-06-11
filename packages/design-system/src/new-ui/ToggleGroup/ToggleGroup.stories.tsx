import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup } from "./ToggleGroup";

const meta: Meta<typeof ToggleGroup> = {
  title: "Components/NewUi/ToggleGroup",
};

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Regular: Story = {
  render: () => (
    <ToggleGroup.Root className="w-[202px]" type="single">
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};
