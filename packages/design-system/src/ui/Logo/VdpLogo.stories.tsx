import type { Meta, StoryObj } from "@storybook/react";
import { VdpLogo } from "./VdpLogo";

const meta: Meta<typeof VdpLogo> = {
  title: "Components/NewUi/VdpLogo",
};

export default meta;

type Story = StoryObj<typeof VdpLogo>;

export const Square: Story = {
  render: () => <VdpLogo variant="square" width={64} />,
};

export const Expand: Story = {
  render: () => <VdpLogo variant="expand" width={128} />,
};
