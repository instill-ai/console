import type { Meta, StoryObj } from "@storybook/react";
import { ModelLogo } from "./ModelLogo";

const meta: Meta<typeof ModelLogo> = {
  title: "Components/NewUi/ModelLogo",
};

export default meta;

type Story = StoryObj<typeof ModelLogo>;

export const Square: Story = {
  render: () => <ModelLogo variant="square" width={64} />,
};

export const Expand: Story = {
  render: () => <ModelLogo variant="expand" width={128} />,
};
