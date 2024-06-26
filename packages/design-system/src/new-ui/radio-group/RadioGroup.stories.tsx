import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "../Label";
import { RadioGroup } from "./RadioGroup";

const meta: Meta<typeof RadioGroup> = {
  title: "Components/NewUi/RadioGroup",
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Regular: Story = {
  render: () => (
    <RadioGroup.Root defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroup.Item value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroup.Item value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroup.Item value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup.Root>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup.Root className="grid-flow-row" defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroup.Item value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroup.Item value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroup.Item value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup.Root>
  ),
};
