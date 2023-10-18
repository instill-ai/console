import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";


const meta: Meta<typeof Label> = {
  title: "Components/NewUi/Label",
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Primary: Story = {
  render: () => (
    <Label >
      I am a label
    </Label>
  ),
};