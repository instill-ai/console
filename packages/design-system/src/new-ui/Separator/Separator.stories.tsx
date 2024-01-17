import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./Separator";

const meta: Meta<typeof Separator> = {
  title: "Components/NewUi/Separator",
};

export default meta;

type Story = StoryObj<typeof Separator>;

export const Regular: Story = {
  render: () => <Separator orientation="horizontal" />,
};

export const WithText: Story = {
  render: () => (
    <div className="relative w-full">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-semantic-bg-primary px-2">
        <p className="text-semantic-fg-primary product-body-text-1-regular">
          Configuration
        </p>
      </div>
      <Separator orientation="horizontal" />
    </div>
  ),
};
